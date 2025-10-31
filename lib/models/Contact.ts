import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IContact extends Document {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  }
}, { timestamps: true });

// Clear any cached model to ensure schema updates are applied
if (models.Contact) {
  delete models.Contact;
}

export default model<IContact>('Contact', ContactSchema);
