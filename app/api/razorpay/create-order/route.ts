import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount, serviceName, serviceId, customerName, customerEmail, customerPhone } = body;
    
    // Validate required fields
    if (!amount || !serviceName || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        serviceName,
        customerName,
        customerEmail,
        customerPhone,
      },
    };
    
    const order = await razorpay.orders.create(options);
    
    // Save payment record to database
    const payment = await Payment.create({
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      status: 'created',
      serviceId,
      serviceName,
      customerName,
      customerEmail,
      customerPhone,
    });
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
