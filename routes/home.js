const express = require('express');
const router = express.Router();

// Define a route for the home page
router.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
    res.render('index', { csrfToken: req.csrfToken() });
});

module.exports = router;
