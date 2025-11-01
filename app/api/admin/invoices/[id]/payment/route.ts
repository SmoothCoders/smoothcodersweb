import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import Client from '@/lib/models/Client';
import ActivityLog from '@/lib/models/ActivityLog';

// POST - Record payment for invoice
export async function POST(
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
    const body = await request.json();
    
    const { amount, method, transactionId, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Get invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if payment exceeds due amount
    if (amount > invoice.amountDue) {
      return NextResponse.json(
        { success: false, error: 'Payment amount exceeds due amount' },
        { status: 400 }
      );
    }

    // Add payment record
    invoice.payments.push({
      amount,
      method,
      transactionId,
      notes,
      recordedBy: (session.user as any)?.id,
      date: new Date(),
    });

    // Update amounts
    const previousPaid = invoice.amountPaid;
    invoice.amountPaid += amount;
    invoice.amountDue = invoice.total - invoice.amountPaid;

    // Update status
    if (invoice.amountPaid >= invoice.total) {
      invoice.status = 'paid';
      if (!invoice.paidAt) {
        invoice.paidAt = new Date();
      }
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'partially-paid';
    }

    await invoice.save();

    // Update client revenue and outstanding
    await Client.findByIdAndUpdate(invoice.client, {
      $inc: { 
        totalRevenue: amount,
        outstandingAmount: -amount,
      },
    });

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'payment-received',
      module: 'invoice',
      targetId: invoice._id,
      targetType: 'Invoice',
      description: `Recorded payment of ₹${amount.toLocaleString()} for invoice ${invoice.invoiceNumber}`,
      metadata: { 
        amount,
        method,
        transactionId,
        previousPaid,
        newPaid: invoice.amountPaid,
      },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Payment recorded successfully',
    });
  } catch (error: any) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
