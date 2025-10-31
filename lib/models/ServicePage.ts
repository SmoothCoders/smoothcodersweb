import mongoose, { Schema, model, models, Document } from 'mongoose';
// Import related models to ensure they're registered
import './Service';
import './City';

export interface IServicePage extends Document {
  _id: string;
  serviceId: mongoose.Types.ObjectId;
  cityId: mongoose.Types.ObjectId;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  content: string;
  slug: string;
  isGenerated: boolean;
  structuredData: object;
  canonicalUrl: string;
  breadcrumbs: { name: string; url: string }[];
  faqSchema?: object;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePageSchema = new Schema<IServicePage>({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  cityId: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true
  },
  metaTitle: {
    type: String,
    required: [true, 'Meta title is required'],
    maxlength: [60, 'Meta title should be max 60 characters']
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required'],
    maxlength: [160, 'Meta description should be max 160 characters']
  },
  keywords: [{
    type: String
  }],
  content: {
    type: String,
    required: [true, 'Page content is required']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  structuredData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  canonicalUrl: {
    type: String,
    required: true
  },
  breadcrumbs: [{
    name: { type: String, required: true },
    url: { type: String, required: true }
  }],
  faqSchema: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create compound index for service + city combination (must be unique)
ServicePageSchema.index({ serviceId: 1, cityId: 1 }, { unique: true });

// Clear any cached model to ensure schema updates are applied
if (models.ServicePage) {
  delete models.ServicePage;
}

export default model<IServicePage>('ServicePage', ServicePageSchema);
