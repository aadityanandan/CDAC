const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/'); // Redirect to login or homepage
    });
});

module.exports = router; 