// backend/routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authenticateToken = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

// Create borrow request (reader only)
router.post('/', authenticateToken, restrictTo('reader'), (req, res) => {
  borrowController.createBorrow(req, res, req.io);
});
// Get user borrows (reader only)
router.get('/', authenticateToken, restrictTo('reader'), borrowController.getUserBorrows);
// Get all borrows (employee only)
router.get('/admin', authenticateToken, restrictTo('employee'), borrowController.getAllBorrows);
// Update borrow status (employee only)
router.put('/:id', authenticateToken, restrictTo('employee'), (req, res) => {
  borrowController.updateBorrowStatus(req, res, req.io);
});

module.exports = router;