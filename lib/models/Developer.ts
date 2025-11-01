import mongoose from 'mongoose';

const DeveloperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'designer', 'mobile', 'devops', 'tester'],
    required: true,
  },
  skills: [{
    type: String,
  }],
  avatar: {
    type: String,
    default: '',
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active',
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  totalProjectsCompleted: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Developer = mongoose.models.Developer || mongoose.model('Developer', DeveloperSchema);

export default Developer;
