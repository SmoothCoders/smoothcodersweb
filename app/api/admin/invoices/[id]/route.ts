import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch single invoice
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
    const invoice = await Invoice.findById(id)
      .populate('client', 'name email phone company address')
      .populate('project', 'name status progress')
      .populate('quotation', 'quotationNumber')
      .populate('createdBy', 'name email');

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update invoice
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
    
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'update',
      module: 'invoice',
      targetId: invoice._id,
      targetType: 'Invoice',
      description: `Updated invoice: ${invoice.invoiceNumber}`,
      metadata: { changes: body },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Invoice updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete invoice
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
    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'delete',
      module: 'invoice',
      targetId: invoice._id,
      targetType: 'Invoice',
      description: `Deleted invoice: ${invoice.invoiceNumber}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
