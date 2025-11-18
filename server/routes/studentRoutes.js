const express = require('express');
const {
  getDashboard,
  getProfile,
  updateProfile,
  getAvailableHostels,
  getAvailableRooms,
  registerStudent,
  loginStudent
} = require('../controllers/studentController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();
router.post('/register', registerStudent); // Register student route
router.post('/login', loginStudent);


router.use(auth);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);
router.get('/hostels', getAvailableHostels);
router.get('/hostels/:id/rooms', getAvailableRooms);

module.exports = router;