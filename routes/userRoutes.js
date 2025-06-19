// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

// Get all users (employee only)
router.get('/', authenticateToken, restrictTo('employee'), userController.getUsers);

module.exports = router;