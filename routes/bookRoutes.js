// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Get books route
router.get('/', bookController.getBooks);

module.exports = router;