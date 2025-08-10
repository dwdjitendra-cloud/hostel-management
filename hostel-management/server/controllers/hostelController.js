const Hostel = require('../models/Hostel');
const Room = require('../models/Room');

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Private
const getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      count: hostels.length,
      data: hostels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single hostel
// @route   GET /api/hostels/:id
// @access  Private
const getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Get rooms for this hostel
    const rooms = await Room.find({ hostel: hostel._id, isActive: true })
      .populate('students', 'name studentId');

    res.json({
      success: true,
      data: {
        hostel,
        rooms
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create hostel
// @route   POST /api/hostels
// @access  Private (Admin)
const createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);

    res.status(201).json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Admin)
const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Admin)
const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Check if hostel has rooms
    const roomCount = await Room.countDocuments({ hostel: hostel._id, isActive: true });
    if (roomCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete hostel with active rooms. Please delete all rooms first.'
      });
    }

    // Soft delete
    hostel.isActive = false;
    await hostel.save();

    res.json({
      success: true,
      message: 'Hostel deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getHostels,
  getHostel,
  createHostel,
  updateHostel,
  deleteHostel
};