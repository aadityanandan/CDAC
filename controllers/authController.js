// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const sendMail = require('../utils/mailer');
// const User = require('../models/User');

// // Define the register function
// const register = async (req, res) => {
//     const { email, password } = req.body;

//     // Log to check if the secret is loaded
//     console.log('JWT Secret:', process.env.JWT_SECRET);

//     // Check if the user already exists in the database
//     User.findUserByEmail(email, async (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: 'Database error' });
//         }

//         if (results.length > 0) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the user's password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Generate a verification token
//         const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Create the new user in the database
//         User.createUser(email, hashedPassword, (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Database error' });
//             }

//             // Send the verification email
//             const verificationLink = `http://localhost:5000/auth/verify?token=${verificationToken}`;
//             sendMail(email, 'Email Verification', `Click the link to verify your email: ${verificationLink}`);

//             res.status(201).json({ message: 'User registered, please check your email for verification' });
//         });
//     });
// };

// // Define the verifyEmail function
// const verifyEmail = (req, res) => {
//     const { token } = req.query;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Update the user's verification status in the database
//         User.verifyUserEmail(decoded.email, (err, result) => {
//             if (err) return res.status(500).json({ error: 'Database error' });

//             if (result.affectedRows === 0) {
//                 return res.status(400).json({ message: 'Invalid token' });
//             }

//             res.status(200).json({ message: 'Email verified successfully' });
//         });
//     } catch (err) {
//         res.status(400).json({ message: 'Invalid or expired token' });
//     }
// };

// // Export the functions
// module.exports = {
//     register,
//     verifyEmail
// };
