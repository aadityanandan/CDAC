// const nodemailer = require('nodemailer');

// const sendMail = (to, subject, text) => {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail', // You can replace this with your preferred service
//         auth: {
//             user: process.env.EMAIL, // Your email
//             pass: process.env.PASSWORD // Your email password
//         }
//     });
//     const mailOptions = {
//         from: process.env.EMAIL,
//         to,
//         subject,
//         text
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log('Error sending mail:', error);
//         }
//         console.log('Email sent:', info.response);
//     });
// };
// module.exports = sendMail;
