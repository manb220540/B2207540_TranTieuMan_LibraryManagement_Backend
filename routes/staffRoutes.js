// backend/routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');
const {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById
} = require('../controllers/staffController.js');

// Tất cả routes đều yêu cầu quyền admin
router.use(auth, adminAuth);

router.get('/', getAllStaff);
router.post('/', createStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;