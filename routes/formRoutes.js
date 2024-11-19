const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const { submitForm } = require('../controllers/formController'); // Import the controller function
const upload = multer();

// Route for form submission
router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
    // Extract reCAPTCHA response from the request body
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const secretKey = '6LfFuWkqAAAAAHv6yI3n8wtSRFMy0NagLqY8Rfqb';  // Replace with your actual reCAPTCHA secret key
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';

    if (!recaptchaResponse) {
        return res.status(400).json({ error: 'reCAPTCHA token missing' });
    }

    try {
        // Verify reCAPTCHA with Google’s API
        const recaptchaVerification = await axios.post(verificationURL, null, {
            params: {
                secret: secretKey,
                response: recaptchaResponse
            }
        });

        console.log('reCAPTCHA verification response:', recaptchaVerification.data);

        const { success } = recaptchaVerification.data;

        if (!success) {
            return res.status(400).json({ error: 'reCAPTCHA validation failed', details: recaptchaVerification.data });
        }

        // If reCAPTCHA validation is successful, proceed to save form data in the database
        submitForm(req, res);

    } catch (error) {
        console.error('Error during reCAPTCHA verification:', error);
        res.status(500).json({ error: 'An error occurred during form submission', details: error.message });
    }
});

module.exports = router;
