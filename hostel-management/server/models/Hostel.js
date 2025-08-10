const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add hostel name'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Boys', 'Girls'],
    required: [true, 'Please specify hostel type']
  },
  totalRooms: {
    type: Number,
    required: [true, 'Please add total number of rooms'],
    min: 1
  },
  totalCapacity: {
    type: Number,
    required: [true, 'Please add total capacity'],
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String
  }],
  address: {
    type: String,
    required: [true, 'Please add hostel address']
  },
  warden: {
    name: String,
    phone: String,
    email: String
  },
  fees: {
    monthly: {
      type: Number,
      required: [true, 'Please add monthly fees']
    },
    security: {
      type: Number,
      required: [true, 'Please add security deposit']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hostel', hostelSchema);