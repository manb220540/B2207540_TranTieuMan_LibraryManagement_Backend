// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');
const upload = require('../config/multer.js'); // Import multer configuration
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
router.post('/', auth, adminAuth,upload.single('image'), createBook);
router.put('/:id', auth,upload.single('image'), adminAuth, updateBook);
router.delete('/:id', auth, adminAuth, deleteBook);

module.exports = router;