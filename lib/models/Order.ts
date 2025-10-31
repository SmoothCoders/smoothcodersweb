import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  serviceId: string;
  serviceName: string;
  tier: 'basic' | 'standard' | 'premium';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  price: number;
  currency: 'INR' | 'USD';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  serviceId: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  tier: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  paymentId: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Clear any cached model
if (models.Order) {
  delete models.Order;
}

export default model<IOrder>('Order', OrderSchema);
