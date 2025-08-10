const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getStudents,
  deleteStudent,
  assignRoom
} = require('../controllers/adminController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
// All routes are protected and admin only
router.use(auth);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);
router.put('/students/:id/assign-room', assignRoom);

module.exports = router;