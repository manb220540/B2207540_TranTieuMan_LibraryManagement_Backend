// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');
const {
  getAllReaders,
  getReaderById,
  deleteReader,
  updateProfile
} = require('../controllers/userController');

// Routes cho admin
router.get('/', auth, adminAuth, getAllReaders);
router.get('/:id', auth, adminAuth, getReaderById);
router.delete('/:id', auth, adminAuth, deleteReader);

// Routes cho độc giả
router.put('/profile', auth, updateProfile);

module.exports = router;