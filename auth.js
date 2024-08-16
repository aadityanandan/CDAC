const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('./mailer');
require('dotenv').config();

const router = express.Router();
const users = [];

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if the JWT secret is loaded
    console.log('JWT Secret:', process.env.JWT_SECRET);

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    users.push({ email, password: hashedPassword, verified: false });

    const verificationLink = `http://localhost:5000/auth/verify?token=${verificationToken}`;
    sendMail(email, 'Email Verification', `Click the link to verify your email: ${verificationLink}`);

    res.status(201).json({ message: 'User registered, please check your email for verification' });
});

module.exports = router;
