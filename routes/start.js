const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const authController = require('../controllers/authController');

// routes.js
router.get('/start', (req, res) => {
    const otp = generateOtp(); // Replace this with your OTP generation logic
    req.session.otp = otp; // Store OTP in the session
    req.session.isVerified = false; // Mark as not yet verified

    console.log('OTP generated and saved in session:', otp);
    res.send('OTP sent to user'); // Replace with actual response (e.g., render or JSON)
});
