import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true,
    trim: true
  },
  razorpayOrderId: {
    type: String,
    required: [true, 'Razorpay Order ID is required'],
    trim: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'completed', 'failed', 'refunded'],
    default: 'created'
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true
  }
}, { timestamps: true });

// Clear any cached model to ensure schema updates are applied
if (models.Payment) {
  delete models.Payment;
}

export default model<IPayment>('Payment', PaymentSchema);
