const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');


// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private (Student)
const getDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate('hostel', 'name type warden amenities fees')
      .populate('room', 'roomNumber type capacity currentOccupancy isAC amenities monthlyRent floor');

    // Get recent complaints
    const Complaint = require('../models/Complaint');
    const recentComplaints = await Complaint.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      data: {
        student,
        recentComplaints
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate('hostel', 'name type address warden amenities fees')
      .populate('room', 'roomNumber type capacity currentOccupancy isAC amenities monthlyRent floor');

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    // Fields that student can update
    const allowedFields = ['name', 'phone'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).populate('hostel room');

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get available hostels
// @route   GET /api/student/hostels
// @access  Private (Student)
const getAvailableHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ 
      isActive: true,
      $expr: { $lt: ['$currentOccupancy', '$totalCapacity'] }
    }).select('name type totalCapacity currentOccupancy amenities fees address');

    res.json({
      success: true,
      data: hostels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get available rooms in hostel
// @route   GET /api/student/hostels/:id/rooms
// @access  Private (Student)
const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      hostel: req.params.id,
      isActive: true,
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    })
      .populate('students', 'name studentId')
      .select('roomNumber type capacity currentOccupancy isAC amenities monthlyRent floor');

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Register a new student
// @route   POST /api/student/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      password,
      phone,
      course,
      year,
      gender
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this email or student ID'
      });
    }

    // Create student
    const student = await Student.create({
      studentId,
      name,
      email,
      password,
      phone,
      course,
      year,
      gender,
      role: 'student' // Default role for students

    });

    const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_SECRET, {
      expiresIn: 7* 24 * 60 * 60 // 7 days
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        year: student.year,
        gender: student.gender,
        role: student.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// @desc    Login student
// @route   POST /api/student/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { email, password, studentId } = req.body;

    if ((!email && !studentId) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student ID or email, and password'
      });
    }

    // Find student by studentId or email
    const student = await Student.findOne(studentId ? { studentId } : { email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60 // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        year: student.year,
        gender: student.gender,
        hostel: student.hostel,
        room: student.room,
        role:student.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login student

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getAvailableHostels,
  getAvailableRooms,
   registerStudent,
  loginStudent
};