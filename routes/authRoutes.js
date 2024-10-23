const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for rendering the registration form
router.get('/register', (req, res) => {
    res.render('register'); // Renders the registration form
});

// Route for handling the registration logic
router.post('/register', authController.register);

// Route for email verification
router.get('/verify', authController.verifyEmail);

module.exports = router;
