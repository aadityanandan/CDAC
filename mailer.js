const nodemailer = require('nodemailer');
require('dotenv').config(); // For loading environment variables

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password
    }
});

// Function to verify the SMTP configuration
const verifySMTP = (callback) => {
    transporter.verify(callback);
};

// Function to send an email
const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to,                       // Receiver email address
        subject: subject,             // Subject of the email
        text: text                    // Plain text body of the email
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendMail, verifySMTP };
