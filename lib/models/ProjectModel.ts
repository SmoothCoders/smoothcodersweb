import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  type: {
    type: String,
    enum: ['web-development', 'mobile-app', 'digital-marketing', 'seo', 'ui-ux-design', 'e-commerce', 'custom'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'on-hold', 'testing', 'completed', 'cancelled'],
    default: 'planning',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  actualEndDate: {
    type: Date,
  },
  developers: [{
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer',
    },
    role: String,
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    hoursAllocated: Number,
    hoursLogged: {
      type: Number,
      default: 0,
    },
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  budget: {
    estimated: {
      type: Number,
      required: true,
    },
    actual: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partially-paid', 'paid', 'overdue'],
    default: 'pending',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  milestones: [{
    name: String,
    description: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    completedAt: Date,
    payment: Number,
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  tasks: [{
    title: String,
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: Date,
    completedAt: Date,
    hoursEstimated: Number,
    hoursActual: Number,
  }],
  activity: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: String,
    description: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  clientRating: {
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    feedback: String,
    ratedAt: Date,
  },
  tags: [{
    type: String,
  }],
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
  },
}, {
  timestamps: true,
});

const ProjectModel = mongoose.models.ProjectModel || mongoose.model('ProjectModel', ProjectSchema);

export default ProjectModel;
