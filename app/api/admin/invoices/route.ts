import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import Client from '@/lib/models/Client';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch all invoices
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

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .populate('client', 'name email company phone')
      .populate('project', 'name status')
      .populate('quotation', 'quotationNumber');

    return NextResponse.json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new invoice
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

    const invoiceData = {
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
      amountDue: total,
      createdBy: (session.user as any)?.id,
    };

    const invoice = await Invoice.create(invoiceData);

    // Update client outstanding amount
    await Client.findByIdAndUpdate(body.client, {
      $inc: { outstandingAmount: total },
    });

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'create',
      module: 'invoice',
      targetId: invoice._id,
      targetType: 'Invoice',
      description: `Created invoice: ${invoice.invoiceNumber}`,
      metadata: { invoiceNumber: invoice.invoiceNumber, client: client.name },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
