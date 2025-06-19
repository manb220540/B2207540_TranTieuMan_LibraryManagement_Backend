// backend/routes/publisherRoutes.js
const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

// Get publishers route
router.get('/', publisherController.getPublishers);

module.exports = router;