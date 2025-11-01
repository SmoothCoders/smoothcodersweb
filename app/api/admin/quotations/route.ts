import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Quotation from '@/lib/models/Quotation';
import Client from '@/lib/models/Client';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch all quotations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    let query: any = {};
    
    if (status) query.status = status;
    if (clientId) query.client = clientId;

    const quotations = await Quotation.find(query)
      .sort({ createdAt: -1 })
      .populate('client', 'name email company phone')
      .populate('convertedToProject', 'name status');

    return NextResponse.json({
      success: true,
      data: quotations,
    });
  } catch (error: any) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new quotation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    
    // Verify client exists
    const client = await Client.findById(body.client);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => sum + item.total, 0);
    
    const discountAmount = body.discount?.type === 'percentage' 
      ? (subtotal * body.discount.value) / 100
      : body.discount?.value || 0;
    
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * (body.tax?.percentage || 18)) / 100;
    const total = taxableAmount + taxAmount;

    const quotationData = {
      ...body,
      subtotal,
      discount: {
        ...body.discount,
        amount: discountAmount,
      },
      tax: {
        percentage: body.tax?.percentage || 18,
        amount: taxAmount,
      },
      total,
      createdBy: (session.user as any)?.id,
    };

    const quotation = await Quotation.create(quotationData);

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'create',
      module: 'quotation',
      targetId: quotation._id,
      targetType: 'Quotation',
      description: `Created quotation: ${quotation.quotationNumber}`,
      metadata: { quotationNumber: quotation.quotationNumber, client: client.name },
    });

    return NextResponse.json({
      success: true,
      data: quotation,
      message: 'Quotation created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
