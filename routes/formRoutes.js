const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const upload = multer(); // Initialize multer
const formController = require('../controllers/formController'); // Import your form controller
// const csrfProtection = require('csrf');
// Define the POST route with multer middleware and formController


router.post('/submit-form-endpoint', upload.none(), formController.submitForm);




// router.post('/submit-form-endpoint', (req, res, next) => {
//     formController.submitForm (req, res, next);
//     console.log('Submitted CSRF Token:', req.body._csrf);
//     console.log('Server-stored CSRF Token:', req.session.csrfToken);
//     next();
// });



module.exports = router;


