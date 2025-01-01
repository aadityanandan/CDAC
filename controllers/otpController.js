const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Controller to send OTP
exports.sendOtp = async (req, res) => {
  const email = req.body.email;
  const otp = generateOtp();

  // Store OTP in session
  req.session.otp = otp;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
    // Redirect to verification page
    // res.redirect('/public/verificationpage.html'); // Adjust this path to your actual verification page route
    res.render('dashboard/verificationPage', {
      // csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('<h2 style="color: red;">Failed to send OTP. Please try again later.</h2>');
  }
};






// exports.verifyOtp = (req, res) => {
//   const { otp } = req.body;

//   // Initialize the failed attempts counter if not already present
//   if (!req.session.failedAttempts) {
//     req.session.failedAttempts = 0;
//   }

//   // OTP Verification Logic
//   if (otp === req.session.otp) {
//     req.session.otp = null; // Clear OTP after successful verification
//     req.session.failedAttempts = 0; // Reset the failed attempts counter
//     req.session.isAuthenticated = true; // Set session authenticated flag

//     // Render the protected page (e.g., pages.html)
//     res.render('dashboard/pages', { csrfToken: req.csrfToken(), 
//       message: 'OTP verified successfully! You are now authenticated.',
//       messageType: 'success', // Pass message type for toastr-like behavior
//     });
//   } else {
//     req.session.failedAttempts += 1;

//     if (req.session.failedAttempts >= 3) {
//       req.session.failedAttempts = 0; // Reset the counter after redirecting

//       // Render the login page with error message
//       res.render('dashboard/index', { csrfToken: req.csrfToken(),  
//         message: 'Too many failed attempts! Redirecting to the login page.',
//         messageType: 'error', // Pass message type for toastr-like behavior
//       });
//     } else {
//       const remainingAttempts = 3 - req.session.failedAttempts;

//       // Render the OTP verification page with error message
//       res.render('dashboard/verificationpage', { csrfToken: req.csrfToken(), 
//         message: `Invalid OTP! You have ${remainingAttempts} attempts remaining.`,
//         messageType: 'error', // Pass message type for toastr-like behavior
//       });
//     }
//   }
// };

// exports.verifyOtp = (req, res) => {
//   const { otp } = req.body;

//   if (req.session.otp && otp === req.session.otp) {
//       // Mark user as authenticated and clear OTP
//       req.session.otp = null;
//       req.session.isVerified = true;

//       console.log('OTP verified, user authenticated'); // Redirect to the dashboard after successful OTP verification
//       res.render('dashboard/pages',{
//         csrfToken: req.csrfToken(),
//           message: 'User Validated',
//           messageType: 'success', // For Toastr notifications
//       } ); 
//   } else {
//       console.log('Invalid OTP attempt');
//       res.render('dashboard/verificationpage', {
//           csrfToken: req.csrfToken(),
//           message: 'Invalid OTP! Please try again.',
//           messageType: 'error', // For Toastr notifications
//       });
//   }
// };


exports.verifyOtp = (req, res) => {
  const {
    otp
  } = req.body; // Get OTP submitted by the user

  // Check if the OTP matches the one in the session
  if (req.session.otp && otp === req.session.otp) {
    req.session.otp = null; // Clear OTP after successful verification
    req.session.isVerified = true; // Mark user as verified

    // Redirect to the authenticated page
    res.redirect('/pages');
    // res.render('dashboard/pages', {
    //   csrfToken: req.csrfToken()
    // });
    console.log('OTP verified, user authenticated');
  } else {

    // If OTP is invalid
    req.session.isVerified = false; // Ensure user remains unverified
    console.log('Invalid OTP');
    res.render('dashboard/verificationpage', {
      // csrfToken: req.csrfToken(),
      message: 'Invalid OTP! Please try again.',
      messageType: 'error',
    });
  }
}; 