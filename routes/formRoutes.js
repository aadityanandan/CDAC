

const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const upload = multer(); // Initialize multer
const formController = require('../controllers/formController'); // Import your form controller

// Define the POST route with multer middleware and formController
router.post('/submit-form-endpoint', upload.none(), formController.submitForm);

module.exports = router;


