import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create', 'update', 'delete',
      'login', 'logout',
      'send', 'approve', 'reject',
      'payment-received', 'payment-sent',
      'status-change', 'assignment',
      'comment', 'upload', 'download',
      'other'
    ],
  },
  module: {
    type: String,
    required: true,
    enum: ['project', 'developer', 'client', 'quotation', 'invoice', 'payment', 'user', 'system'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  targetType: {
    type: String,
    enum: ['Project', 'Developer', 'Client', 'Quotation', 'Invoice', 'User'],
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

// Index for faster queries
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ module: 1, createdAt: -1 });
ActivityLogSchema.index({ targetId: 1, targetType: 1 });

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
