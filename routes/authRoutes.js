// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginStaff, loginReader, registerReader } = require('../controllers/authController.js');

router.post('/staff/login', loginStaff);
router.post('/reader/login', loginReader);
router.post('/reader/register', registerReader);

module.exports = router;