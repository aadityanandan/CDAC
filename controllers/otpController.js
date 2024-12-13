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
      res.redirect('/public/verificationpage.html'); // Adjust this path to your actual verification page route
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('<h2 style="color: red;">Failed to send OTP. Please try again later.</h2>');
    }
  };
  









// Controller to verify OTP
exports.verifyOtp = (req, res) => {
    const { otp } = req.body;
  
    // Initialize the failed attempts counter if not already present
    if (!req.session.failedAttempts) {
      req.session.failedAttempts = 0;
    }
  
    if (otp === req.session.otp) {
      req.session.otp = null; // Clear the OTP after successful verification
      req.session.failedAttempts = 0; // Reset the counter on success
      res.send(`
        <script>
          window.onload = function() {
            toastr.success('OTP verified successfully! You are now authenticated.');
            setTimeout(() => {
              window.location.href = '/public/pages.html';
            }, 2000); // Redirect after 2 seconds
          };
        </script>
        <link rel="stylesheet" href="/public/plugins/toastr/toastr.min.css">
        <script src="/public/plugins/jquery/jquery.min.js"></script>
        <script src="/public/plugins/toastr/toastr.min.js"></script>
      `);
    } else {
      req.session.failedAttempts += 1;
  
      if (req.session.failedAttempts >= 3) {
        req.session.failedAttempts = 0; // Reset the counter after redirecting
        res.send(`
          <script>
            window.onload = function() {
              toastr.error('Too many failed attempts! Redirecting to the previous page.');
              setTimeout(() => {
                window.location.href = '/public/index.html';
              }, 2000); // Redirect after 2 seconds
            };
          </script>
          <link rel="stylesheet" href="/public/plugins/toastr/toastr.min.css">
          <script src="/public/plugins/jquery/jquery.min.js"></script>
          <script src="/public/plugins/toastr/toastr.min.js"></script>
        `);
      } else {
        res.send(`
          <script>
            window.onload = function() {
              toastr.error('Invalid OTP! You have ${3 - req.session.failedAttempts} attempts remaining.');
              setTimeout(() => {
                window.location.href = '/public/verificationpage.html';
              }, 2000); // Redirect after 2 seconds
            };
          </script>
          <link rel="stylesheet" href="/public/plugins/toastr/toastr.min.css">
          <script src="/public/plugins/jquery/jquery.min.js"></script>
          <script src="/public/plugins/toastr/toastr.min.js"></script>
        `);
      }
    }
  };

