const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
// const csrfProtection = require('csrf');

// Setup CSRF protection middleware
router.use(cookieParser());
router.use(express.urlencoded({
    extended: false
})); // Body parser for form data

// CSRF protection setup (declare only once)
const csrfProtection = csrf({
    cookie: true
});

router.use(csrfProtection, (req, res, next) => {
    next();
})

// Routes
// router.get('/', csrfProtection, (req, res) => {
//     res.render('process', {
//         csrfToken: req.csrfToken()
//     });
// });

// router.post('/', csrfProtection, (req, res) => {
//     // Process the form data
//     res.send('Form processed successfully.');
// });

module.exports = router;