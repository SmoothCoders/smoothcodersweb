import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Quotation from '@/lib/models/Quotation';
import ProjectModel from '@/lib/models/ProjectModel';
import Client from '@/lib/models/Client';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch single quotation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const quotation = await Quotation.findById(id)
      .populate('client', 'name email phone company address')
      .populate('convertedToProject', 'name status progress')
      .populate('createdBy', 'name email');

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quotation,
    });
  } catch (error: any) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update quotation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    
    // Recalculate totals if items changed
    if (body.items) {
      const subtotal = body.items.reduce((sum: number, item: any) => sum + item.total, 0);
      
      const discountAmount = body.discount?.type === 'percentage' 
        ? (subtotal * body.discount.value) / 100
        : body.discount?.value || 0;
      
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * (body.tax?.percentage || 18)) / 100;
      const total = taxableAmount + taxAmount;

      body.subtotal = subtotal;
      body.discount = {
        ...body.discount,
        amount: discountAmount,
      };
      body.tax = {
        percentage: body.tax?.percentage || 18,
        amount: taxAmount,
      };
      body.total = total;
    }

    const quotation = await Quotation.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'update',
      module: 'quotation',
      targetId: quotation._id,
      targetType: 'Quotation',
      description: `Updated quotation: ${quotation.quotationNumber}`,
      metadata: { changes: body },
    });

    return NextResponse.json({
      success: true,
      data: quotation,
      message: 'Quotation updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete quotation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const quotation = await Quotation.findByIdAndDelete(id);

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'delete',
      module: 'quotation',
      targetId: quotation._id,
      targetType: 'Quotation',
      description: `Deleted quotation: ${quotation.quotationNumber}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Quotation deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
