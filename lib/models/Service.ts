import mongoose, { Schema, model, models } from 'mongoose';

export interface IPricingTier {
  name: string;
  title: string;
  description: string;
  priceINR: number;
  priceUSD: number;
  features: string[];
  deliveryDays: number;
  revisions: string; // "Unlimited" or number
  isPopular?: boolean;
  contactForPricing?: boolean; // For premium tiers that require custom quotes
}

export interface IService extends Document {
  _id: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  price: number; // Kept for backward compatibility (will use Basic tier price)
  category: string;
  slug: string;
  features: string[];
  isActive: boolean;
  // New pricing tiers
  pricingTiers: {
    basic: IPricingTier;
    standard: IPricingTier;
    premium: IPricingTier;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title should be max 60 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description should be max 160 characters']
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Web Development', 'Mobile App', 'Digital Marketing', 'E-commerce', 'Design', 'Other']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  pricingTiers: {
    basic: {
      name: { type: String, default: 'Basic' },
      title: { type: String, required: true },
      description: { type: String, required: true },
      priceINR: { type: Number, required: true, min: 0 },
      priceUSD: { type: Number, required: true, min: 0 },
      features: [{ type: String }],
      deliveryDays: { type: Number, required: true, min: 1 },
      revisions: { type: String, required: true },
      isPopular: { type: Boolean, default: false },
      contactForPricing: { type: Boolean, default: false }
    },
    standard: {
      name: { type: String, default: 'Standard' },
      title: { type: String, required: true },
      description: { type: String, required: true },
      priceINR: { type: Number, required: true, min: 0 },
      priceUSD: { type: Number, required: true, min: 0 },
      features: [{ type: String }],
      deliveryDays: { type: Number, required: true, min: 1 },
      revisions: { type: String, required: true },
      isPopular: { type: Boolean, default: false },
      contactForPricing: { type: Boolean, default: false }
    },
    premium: {
      name: { type: String, default: 'Premium' },
      title: { type: String, required: true },
      description: { type: String, required: true },
      priceINR: { type: Number, required: false, min: 0, default: 0 },
      priceUSD: { type: Number, required: false, min: 0, default: 0 },
      features: [{ type: String }],
      deliveryDays: { type: Number, required: true, min: 1 },
      revisions: { type: String, required: true },
      isPopular: { type: Boolean, default: false },
      contactForPricing: { type: Boolean, default: true } // Premium defaults to contact for pricing
    }
  }
}, {
  timestamps: true
});

// Auto-generate slug from title before saving
ServiceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Clear any cached model to ensure schema updates are applied
if (models.Service) {
  delete models.Service;
}

export default model<IService>('Service', ServiceSchema);
