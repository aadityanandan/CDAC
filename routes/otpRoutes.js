const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const authController = require('../controllers/authController');
// const cookieParser = require('cookie-parser')
// var csrf = require('csurf');


// router.get('/', (req, res) => {
//     console.log('CSRF Token for /:', req.session.csrfToken);
//     res.render('dashboard/index', { csrfToken: req.session.csrfToken });
// });

router.get('/', (req, res) => {
res.render('dashboard/index'); 
});


// router.get('/verificationpage', authController.isAuthenticated, (req, res) => {
//     console.log('CSRF Token for /verificationpage:', req.session.csrfToken);
//     res.render('dashboard/verificationpage', { csrfToken: req.session.csrfToken });
// });

router.get('/verificationpage', authController.isAuthenticated, (req, res) => {
    res.render('dashboard/verificationpage'); 
    });

// router.get('/pages', authController.isAuthenticated, (req, res) => {
//     console.log('CSRF Token for /pages:', req.session.csrfToken);
//     res.render('dashboard/pages', { csrfToken: req.session.csrfToken });
// });

router.get('/pages', authController.isAuthenticated, (req, res) => { 
    res.render('dashboard/pages'); 
    });




// Route to send OTP
router.post('/generate-otp', otpController.sendOtp);

// Route to verify OTP
router.post("/verify-otp", otpController.verifyOtp); 



module.exports = router;