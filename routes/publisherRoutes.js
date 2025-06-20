// backend/routes/publisherRoutes.js
const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/authMiddleware.js');
const {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
  getPublisherById
} = require('../controllers/publisherController.js');

// Routes công khai
router.get('/', getAllPublishers);
router.get('/:id', getPublisherById);

// Routes yêu cầu quyền admin
router.post('/', auth, adminAuth, createPublisher);
router.put('/:id', auth, adminAuth, updatePublisher);
router.delete('/:id', auth, adminAuth, deletePublisher);

module.exports = router;