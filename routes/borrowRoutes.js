// backend/routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');
const {
  getAllBorrowRequests,
  getReaderBorrowHistory,
  createBorrowRequest,
  updateBorrowRequest
} = require('../controllers/borrowController.js');

// Routes cho admin
router.get('/admin/requests', auth, adminAuth, getAllBorrowRequests);
router.put('/admin/requests/:id', auth, adminAuth, updateBorrowRequest);

// Routes cho độc giả
router.get('/history', auth, getReaderBorrowHistory);
router.post('/request', auth, createBorrowRequest);

module.exports = router;