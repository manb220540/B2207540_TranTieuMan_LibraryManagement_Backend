// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginStaff, loginReader, registerReader } = require('../controllers/authController.js');
const { requestPasswordReset, confirmPasswordReset } = require('../controllers/authController.js');

router.post('/staff/login', loginStaff);
router.post('/reader/login', loginReader);
router.post('/reader/register', registerReader);
router.post('/reader/password/request-reset', requestPasswordReset);
router.post('/reader/password/reset', confirmPasswordReset);

module.exports = router;