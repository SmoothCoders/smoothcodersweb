import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IInquiryMessage {
  sender: 'client' | 'admin';
  message: string;
  timestamp: Date;
}

export interface IInquiry extends Document {
  _id: string;
  // Client info
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany?: string;
  // Service info
  serviceId: mongoose.Types.ObjectId | string;
  serviceName: string;
  projectDescription: string;
  // Order/Pricing info
  tier?: 'basic' | 'standard' | 'premium';
  price?: number;
  currency?: 'INR' | 'USD';
  type?: 'order' | 'chat'; // Type of inquiry
  // Additional fields
  budget?: string;
  timeline?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  messages: IInquiryMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  sender: {
    type: String,
    enum: ['client', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const InquirySchema = new Schema<IInquiry>({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  clientEmail: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  clientPhone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  clientCompany: {
    type: String,
    trim: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  projectDescription: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  tier: {
    type: String,
    enum: ['basic', 'standard', 'premium']
  },
  price: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    enum: ['INR', 'USD']
  },
  type: {
    type: String,
    enum: ['order', 'chat'],
    default: 'chat'
  },
  budget: {
    type: String,
    trim: true
  },
  timeline: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  messages: [MessageSchema]
}, { timestamps: true });

// Clear any cached model to ensure schema updates are applied
if (models.Inquiry) {
  delete models.Inquiry;
}

export default model<IInquiry>('Inquiry', InquirySchema);
