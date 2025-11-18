const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add room number']
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'Please assign hostel']
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Quadruple'],
    required: [true, 'Please specify room type']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add room capacity'],
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  isAC: {
    type: Boolean,
    default: false
  },
  amenities: [{
    type: String
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  monthlyRent: {
    type: Number,
    required: [true, 'Please add monthly rent']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  floor: {
    type: Number,
    required: [true, 'Please add floor number']
  }
}, {
  timestamps: true
});

// Compound index for unique room number within a hostel
roomSchema.index({ roomNumber: 1, hostel: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);