import mongoose from 'mongoose';

const QuotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    enum: ['web-development', 'mobile-app', 'digital-marketing', 'seo', 'ui-ux-design', 'e-commerce', 'custom'],
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'approved', 'rejected', 'expired', 'converted'],
    default: 'draft',
  },
  items: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    quantity: {
      type: Number,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['development', 'design', 'domain', 'hosting', 'maintenance', 'marketing', 'other'],
      default: 'development',
    },
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    value: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  tax: {
    percentage: {
      type: Number,
      default: 18,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  total: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentTerms: {
    type: String,
    default: '50% advance, 50% on completion',
  },
  deliveryTimeline: {
    type: String,
    default: '4-6 weeks',
  },
  notes: {
    type: String,
    default: '',
  },
  termsAndConditions: {
    type: String,
    default: '',
  },
  revisions: [{
    version: Number,
    items: Array,
    subtotal: Number,
    discount: Object,
    tax: Object,
    total: Number,
    revisedAt: {
      type: Date,
      default: Date.now,
    },
    revisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
  }],
  sentAt: Date,
  viewedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  convertedToProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectModel',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Auto-generate quotation number
QuotationSchema.pre('save', async function(next) {
  if (!this.quotationNumber) {
    const count = await mongoose.model('Quotation').countDocuments();
    const year = new Date().getFullYear();
    this.quotationNumber = `QUO-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Quotation = mongoose.models.Quotation || mongoose.model('Quotation', QuotationSchema);

export default Quotation;
