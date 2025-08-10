const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public (can restrict later)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: 7 * 24 * 60 * 60 // 7 days
  });
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists with this email'
      });
    }

    // Create admin
    const admin = await Admin.create({ name, email, password });

    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    const token = generateToken(admin._id, admin.role);

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalHostels = await Hostel.countDocuments({ isActive: true });
    const totalRooms = await Room.countDocuments({ isActive: true });
    const openComplaints = await Complaint.countDocuments({ status: { $nin: ['Resolved', 'Closed'] } });

    // Get recent complaints
    const recentComplaints = await Complaint.find()
      .populate('student', 'name studentId')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get hostel occupancy
    const hostels = await Hostel.find({ isActive: true }).select('name totalCapacity currentOccupancy');

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalHostels,
          totalRooms,
          openComplaints
        },
        recentComplaints,
        hostels
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const hostel = req.query.hostel || '';

    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (hostel) {
      query.hostel = hostel;
    }

    const students = await Student.find(query)
      .populate('hostel', 'name')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from room if assigned
    if (student.room) {
      await Room.findByIdAndUpdate(
        student.room,
        { 
          $pull: { students: student._id },
          $inc: { currentOccupancy: -1 }
        }
      );
    }

    // Update hostel occupancy if assigned
    if (student.hostel) {
      await Hostel.findByIdAndUpdate(
        student.hostel,
        { $inc: { currentOccupancy: -1 } }
      );
    }

    // Soft delete
    student.isActive = false;
    await student.save();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign room to student
// @route   PUT /api/admin/students/:id/assign-room
// @access  Private (Admin)
const assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const student = await Student.findById(req.params.id);
    const room = await Room.findById(roomId).populate('hostel');

    if (!student || !room) {
      return res.status(404).json({
        success: false,
        message: 'Student or Room not found'
      });
    }

    // Check if room has capacity
    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Room is full'
      });
    }

    // Remove from previous room if assigned
    if (student.room) {
      await Room.findByIdAndUpdate(
        student.room,
        { 
          $pull: { students: student._id },
          $inc: { currentOccupancy: -1 }
        }
      );
    }

    // Remove from previous hostel if assigned
    if (student.hostel && student.hostel.toString() !== room.hostel._id.toString()) {
      await Hostel.findByIdAndUpdate(
        student.hostel,
        { $inc: { currentOccupancy: -1 } }
      );
    }

    // Assign new room and hostel
    student.room = room._id;
    student.hostel = room.hostel._id;
    await student.save();

    // Update room
    await Room.findByIdAndUpdate(
      roomId,
      { 
        $push: { students: student._id },
        $inc: { currentOccupancy: 1 }
      }
    );

    // Update hostel occupancy if it's a new hostel
    if (!student.hostel || student.hostel.toString() !== room.hostel._id.toString()) {
      await Hostel.findByIdAndUpdate(
        room.hostel._id,
        { $inc: { currentOccupancy: 1 } }
      );
    }

    res.json({
      success: true,
      message: 'Room assigned successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getStudents,
  deleteStudent,
  assignRoom
};