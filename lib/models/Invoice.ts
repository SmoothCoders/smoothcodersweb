import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectModel',
  },
  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'partially-paid', 'paid', 'overdue', 'cancelled'],
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
  amountPaid: {
    type: Number,
    default: 0,
  },
  amountDue: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  payments: [{
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['cash', 'bank-transfer', 'upi', 'card', 'razorpay', 'stripe', 'paypal', 'other'],
    },
    transactionId: String,
    notes: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  notes: {
    type: String,
    default: '',
  },
  termsAndConditions: {
    type: String,
    default: '',
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String,
  },
  sentAt: Date,
  viewedAt: Date,
  paidAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Auto-generate invoice number
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate amount due
  this.amountDue = this.total - this.amountPaid;
  
  // Update status based on payment
  if (this.amountPaid >= this.total) {
    this.status = 'paid';
    if (!this.paidAt) {
      this.paidAt = new Date();
    }
  } else if (this.amountPaid > 0) {
    this.status = 'partially-paid';
  } else if (this.status !== 'draft' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  
  next();
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

export default Invoice;
