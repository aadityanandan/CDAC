const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const authController = require('../controllers/authController');
const { isAuthenticated} = authController;


// router.use((req, res, next) => {
//     csrf
// })

router.get('/', function (req, res) {
    res.render('Dashboard/index.ejs',{csrfToken:"sdasdasdasd"});
});

router.get('/pages', function(req, res) {
    res.render('Dashboard/pages.ejs',{csrfToken:"sdasdasdasd"});
});

router.get('/verificationPage', function(req, res) {
    res.render('Dashboard/verificationPage.ejs',{csrfToken:"sdasdasdasd"});
});




// router.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

// Route to send OTP
router.post('/generate-otp', otpController.sendOtp);


// Route to verify OTP
// router.post("/verify-otp", authController.isAuthenticated, otpController.verifyOtp);
router.post("/verify-otp", otpController.verifyOtp);





module.exports = router;