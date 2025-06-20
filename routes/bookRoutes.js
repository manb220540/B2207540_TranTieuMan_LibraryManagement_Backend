// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');
const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookById
} = require('../controllers/bookController.js');

// Routes công khai
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Routes yêu cầu quyền admin
router.post('/', auth, adminAuth, createBook);
router.put('/:id', auth, adminAuth, updateBook);
router.delete('/:id', auth, adminAuth, deleteBook);

module.exports = router;