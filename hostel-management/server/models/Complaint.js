const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  subject: {
    type: String,
    required: [true, 'Please add complaint subject'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add complaint description']
  },
  category: {
    type: String,
    enum: ['Food Quality', 'Electricity Issues', 'Laundry Services', 'Ragging', 'Maintenance', 'Other'],

    required: [true, 'Please select complaint category']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  resolution: {
    type: String,
    default: ''
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'comments.authorModel'
    },
    authorModel: {
      type: String,
      enum: ['Student', 'Admin']
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);