import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
    
    // Verify signature
    const text = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');
    
    const isValid = expectedSignature === razorpaySignature;
    
    if (isValid) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
          razorpayPaymentId,
          razorpaySignature,
          status: 'success',
        }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed' }
      );
      
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
