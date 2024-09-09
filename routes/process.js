const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
// const csrfProtection = require('csrf');
 
// Setup CSRF protection middleware
router.use(cookieParser());
router.use(express.urlencoded({ extended: false })); // Body parser for form data

// CSRF protection setup (declare only once)
const csrfProtection = csrf({ cookie: true });

// Routes
router.get('/process', csrfProtection, (req, res) => {
    res.render('process', { csrfToken: req.csrfToken() }); // This should work now
    // res.send('process'+req.csrfToken()); // This should work now
});

router.post('/process', csrfProtection, (req, res) => {
    // Process the form data
    res.send('Form processed successfully.');
});

module.exports = router;
