const express = require('express');
const {
  registerAdmin,
  registerStudent,
  login,
  getMe
} = require('../controllers/authController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/admin/register', registerAdmin);
router.post('/student/register',  registerStudent);
//auth, authorize('admin')
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;