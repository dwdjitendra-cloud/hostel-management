const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .get(getRooms)
  .post(authorize('admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(authorize('admin'), updateRoom)
  .delete(authorize('admin'), deleteRoom);

module.exports = router;