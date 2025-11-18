const express = require('express');
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  addComment,
  deleteComplaint
} = require('../controllers/complaintController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.route('/:id')
  .get(getComplaint)
  .put(authorize('admin'), updateComplaint)
  .delete(authorize('admin'), deleteComplaint);

router.post('/:id/comments', addComment);

module.exports = router;