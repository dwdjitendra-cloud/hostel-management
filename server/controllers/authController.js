const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register admin
// @route   POST /api/auth/admin/register
// @access  Public (for initial setup)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password
    });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register student
// @route   POST /api/auth/student/register
// @access  Private (Admin only)
const registerStudent = async (req, res) => {
  try {
    const { studentId, name, email, password, phone, course, year, gender } = req.body;

    // Check if student exists
    const studentExists = await Student.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    if (studentExists) {
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
      gender
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        year: student.year,
        gender: student.gender
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user (Admin/Student)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role, studentId } = req.body;

    // Validate email & password
    if ((!email && !studentId) || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/student ID, password and role'
      });
    }

    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      // For students, try to find by studentId first, then by email
      if (studentId) {
        user = await Student.findOne({ studentId }).populate('hostel room');
      } else {
        user = await Student.findOne({ email }).populate('hostel room');
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.'
      });
    }

    const token = generateToken(user._id, user.role);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (role === 'student') {
      userData.studentId = user.studentId;
      userData.phone = user.phone;
      userData.course = user.course;
      userData.year = user.year;
      userData.gender = user.gender;
      userData.hostel = user.hostel;
      userData.room = user.room;
    }

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id);
    } else {
      user = await Student.findById(req.user.id).populate('hostel room');
    }

    res.json({
      success: true,
      user
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
  registerStudent,
  login,
  getMe
};