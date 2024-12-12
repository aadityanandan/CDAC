const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const authController = require('../controllers/authController');
const {
    isAuthenticated
} = authController;


// router.use((req, res, next) => {
//     csrf
// })

router.get('/asd', function (req, res) {
    res.render('Dashboard/index.ejs',{csrfToken:"sdasdasdasd"});
});

router.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Route to send OTP
router.post('/generate-otp', otpController.sendOtp);

// router.post('/generate-otp', (req, res) => {
//     const {
//         email
//     } = req.body;

//     // OTP generation and sending logic here
//     sendOtp(email)
//         .then(() => {
//             // Redirect to verification.html after success
//             res.redirect('/verification.html');
//         })
//         .catch(error => {
//             console.error('Error sending OTP:', error);
//             res.status(500).send('Failed to send OTP');
//         });
// });

// Route to verify OTP
// router.post("/verify-otp", authController.isAuthenticated, otpController.verifyOtp);
router.post("/verify-otp", otpController.verifyOtp);



module.exports = router;