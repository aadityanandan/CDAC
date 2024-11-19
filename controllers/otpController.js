require('dotenv').config();
const nodemailer = require('nodemailer');

console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)

// Configure Nodemailer
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

// Generate a random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Controller to send OTP
exports.sendOtp = async (req, res) => {
    const email = req.body.email;
    const otp = generateOtp();

    // Store OTP in session
    req.session.otp = otp;

    // Send OTP email
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, message: 'Error sending OTP.' });
    }
};

// Controller to verify OTP
exports.verifyOtp = (req, res) => {
    const userOtp = req.body.otp;

    // Check if the OTP matches the one stored in session
    if (userOtp === req.session.otp) {
        req.session.otp = null; // Clear OTP after successful verification
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Incorrect OTP' });
    }
};
