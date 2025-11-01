import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  avatar: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead', 'converted'],
    default: 'lead',
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'cold-call', 'other'],
    default: 'website',
  },
  totalProjects: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  outstandingAmount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  notes: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  communicationHistory: [{
    type: {
      type: String,
      enum: ['email', 'call', 'meeting', 'message'],
    },
    subject: String,
    notes: String,
    date: {
      type: Date,
      default: Date.now,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  lastContactedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

export default Client;
