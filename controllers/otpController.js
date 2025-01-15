const nodemailer = require('nodemailer');
require('dotenv').config();

// // Function to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Nodemailer transporter
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


// exports.sendOtp = async (req, res) => {
//   const email = req.body.email; // Get the email from the request body
//   const otp = generateOtp();

//   // Store OTP and timestamp in session
//   req.session.otp = otp;
//   req.session.otpTimestamp = Date.now(); // Record the OTP generation time

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP code is: ${otp}`,
//     });

//     console.log(`OTP sent to ${email}: ${otp}`);

//     // Render the verification page and pass the email
//     res.render('dashboard/verificationPage', { userEmail: email });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send('<h2 style="color: red;">Failed to send OTP. Please try again later.</h2>');
//   }
// };






// // Controller to verify OTP
// exports.verifyOtp = (req, res) => {
//   const { otp } = req.body; // Get OTP submitted by the user
//   const otpValidityDuration = 5 * 60 * 1000; // OTP is valid for 5 minutes (adjust as needed)

//   // Check if OTP exists and matches
//   if (req.session.otp && otp === req.session.otp) {
//     const currentTime = Date.now();

//     // Check OTP expiration
//     if (currentTime - req.session.otpTimestamp <= otpValidityDuration) {
//       // OTP is valid
//       req.session.otp = null; // Clear OTP after successful verification
//       req.session.otpTimestamp = null; // Clear the timestamp
//       req.session.isVerified = true; // Mark user as verified

//       console.log('OTP verified, user authenticated');
//       res.redirect('/pages'); // Redirect to authenticated page
//     } else {
//       // OTP has expired
//       console.log('Expired OTP');
//       res.render('dashboard/verificationpage', {
//         message: 'OTP has expired. Please request a new one.',
//         messageType: 'error',
//       });
//     }
//   } else {
//     // OTP is invalid
//     req.session.isVerified = false; // Ensure user remains unverified
//     console.log('Invalid OTP');
//     res.render('dashboard/verificationpage', {
//       message: 'Invalid OTP! Please try again.',
//       messageType: 'error',
//     });
//   }
// };




// Controller to send OTP
exports.sendOtp = async (req, res) => {
  const email = req.body.email; // Get the email from the request body
  if (!email) {
    return res.status(400).send('<h2 style="color: red;">Email is required to send OTP.</h2>');
  }

  const otp = generateOtp();

  // Store OTP and timestamp in session
  req.session.otp = otp;
  req.session.otpTimestamp = Date.now(); // Record the OTP generation time
  req.session.email = email; // Store email in session for later use

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);

    // Render the verification page and pass the email
    res.render('dashboard/verificationPage', {
      userEmail: email,
      message: null, // No error message initially
      messageType: null, // No error type initially
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('<h2 style="color: red;">Failed to send OTP. Please try again later.</h2>');
  }
};

// Controller to verify OTP
exports.verifyOtp = (req, res) => {
  const { otp } = req.body; // Get OTP submitted by the user
  const email = req.session.email; // Retrieve email from the session
  const otpValidityDuration = 5 * 60 * 1000; // OTP is valid for 5 minutes (adjust as needed)

  if (!email) {
    return res.status(400).render('dashboard/verificationPage', {
      userEmail: null,
      message: 'Session expired. Please start over.',
      messageType: 'error',
    });
  }

  // Check if OTP exists and matches
  if (req.session.otp && otp === req.session.otp) {
    const currentTime = Date.now();

    // Check OTP expiration
    if (currentTime - req.session.otpTimestamp <= otpValidityDuration) {
      // OTP is valid
      req.session.otp = null; // Clear OTP after successful verification
      req.session.otpTimestamp = null; // Clear the timestamp
      req.session.isVerified = true; // Mark user as verified

      console.log('OTP verified, user authenticated');
      return res.redirect('/pages'); // Redirect to authenticated page
    } else {
      // OTP has expired
      console.log('Expired OTP');
      return res.render('dashboard/verificationPage', {
        userEmail: email,
        message: 'OTP has expired. Please request a new one.',
        messageType: 'error',
      });
    }
  } else {
    // OTP is invalid
    req.session.isVerified = false; // Ensure user remains unverified
    console.log('Invalid OTP');
    return res.render('dashboard/verificationPage', {
      userEmail: email,
      message: 'Invalid OTP! Please try again.',
      messageType: 'error',
    });
  }
};


