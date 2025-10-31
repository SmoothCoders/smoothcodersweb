import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ICity extends Document {
  _id: string;
  name: string;
  slug: string;
  state: string;
  landmarks?: string[]; // Local landmarks for unique content (e.g., "Baner, Viman Nagar")
  localKeywords?: string[]; // Keywords for AI content generation
  description?: string; // Brief city description
  isActive: boolean;
  pagesGenerated: boolean;
  generatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    maxlength: [50, 'City name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  landmarks: {
    type: [String],
    default: []
  },
  localKeywords: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pagesGenerated: {
    type: Boolean,
    default: false
  },
  generatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Auto-generate slug from city name before saving
CitySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Clear any cached model to ensure schema updates are applied
if (models.City) {
  delete models.City;
}

export default model<ICity>('City', CitySchema);
