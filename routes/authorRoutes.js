// backend/routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');

const {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById
} = require('../controllers/authorController.js');  
// Routes công khai
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);  
// Routes yêu cầu quyền admin
router.post('/', auth, adminAuth, createAuthor);
router.put('/:id', auth, adminAuth, updateAuthor);
router.delete('/:id', auth, adminAuth, deleteAuthor);

module.exports = router;