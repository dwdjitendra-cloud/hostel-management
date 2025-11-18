const Room = require('../models/Room');
const Hostel = require('../models/Hostel');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
  try {
    const { hostel, available } = req.query;
    
    let query = { isActive: true };
    
    if (hostel) {
      query.hostel = hostel;
    }
    
    if (available === 'true') {
      query.$expr = { $lt: ['$currentOccupancy', '$capacity'] };
    }

    const rooms = await Room.find(query)
      .populate('hostel', 'name type')
      .populate('students', 'name studentId')
      .sort({ hostel: 1, roomNumber: 1 });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hostel', 'name type warden')
      .populate('students', 'name studentId email phone course year');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (Admin)
const createRoom = async (req, res) => {
  try {
    const { hostel: hostelId } = req.body;

    // Check if hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    const room = await Room.create(req.body);
    
    // Update hostel total capacity
    await Hostel.findByIdAndUpdate(
      hostelId,
      { $inc: { totalRooms: 1, totalCapacity: room.capacity } }
    );

    await room.populate('hostel', 'name type');

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin)
const updateRoom = async (req, res) => {
  try {
    const oldRoom = await Room.findById(req.params.id);
    if (!oldRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('hostel', 'name type');

    // Update hostel capacity if room capacity changed
    if (req.body.capacity && req.body.capacity !== oldRoom.capacity) {
      const capacityDiff = req.body.capacity - oldRoom.capacity;
      await Hostel.findByIdAndUpdate(
        room.hostel._id,
        { $inc: { totalCapacity: capacityDiff } }
      );
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has students
    if (room.currentOccupancy > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with students. Please reassign students first.'
      });
    }

    // Update hostel capacity
    await Hostel.findByIdAndUpdate(
      room.hostel,
      { 
        $inc: { 
          totalRooms: -1, 
          totalCapacity: -room.capacity 
        } 
      }
    );

    // Soft delete
    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
};