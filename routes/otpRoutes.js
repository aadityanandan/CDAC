const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// Route to send OTP
router.post('/api/send-otp', otpController.sendOtp);

// Route to verify OTP
router.post('/api/verify-otp', otpController.verifyOtp);

module.exports = router;