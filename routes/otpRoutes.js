const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const authController = require('../controllers/authController');
// const cookieParser = require('cookie-parser')
// var csrf = require('csurf');


router.get('/', (req, res) => {
res.render('dashboard/index'); 
});




// router.get('/verificationpage',authController.isAuthenticated, (req, res) => {
//     res.render('dashboard/verificationpage'); 
//     });


    router.get('/verificationpage', (req, res) => {
        res.render('dashboard/verificationpage'); 
        });
    



// router.get('/pages',authController.isAuthenticated,(req, res) => { 
//     res.render('dashboard/pages'); 
//     });

    router.get('/pages',(req, res) => { 
        res.render('dashboard/pages'); 
        });
    

        
   router.get('/vpn', (req, res) =>{
       res.render('dashboard/vpn');
   });
  

   router.get('/firewall', (req,res)=> {
    res.render('dashboard/firewall')
   });


//    router.get('/submitted-forms', (req, res) =>{
//     res.render('dashboard/details');
//    });





// Route to send OTP
router.post('/generate-otp', otpController.sendOtp);

// Route to verify OTP
router.post("/verify-otp", otpController.verifyOtp); 

// Route to resend OTP
router.post('/send-otp', otpController.sendOtp);

module.exports = router; 