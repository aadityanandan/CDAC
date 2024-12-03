// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const axios = require('axios');
// const upload = multer();
// const { submitForm } = require('../controllers/formController');

// // Route for form submission
// router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
//     const recaptchaResponse = req.body['g-recaptcha-response'];
//     const secretKey = '6Lcz8I8qAAAAADvAu4IVZnhxGCpCt3Y8q3npNuWh';
//     const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';

//     if (!recaptchaResponse) {
//         return res.status(400).json({ error: 'reCAPTCHA token missing' });
//     }

//     try {
//         const recaptchaVerification = await axios.post(verificationURL, null, {
//             params: { secret: secretKey, response: recaptchaResponse },
//         });

//         console.log('reCAPTCHA verification response:', recaptchaVerification.data);

//         if (!recaptchaVerification.data.success) {
//             return res.status(400).json({ error: 'reCAPTCHA validation failed', details: recaptchaVerification.data });
//         }

//         // Call the submitForm controller to handle further processing
//         submitForm(req, res);

//     } catch (error) {
//         console.error('Error during reCAPTCHA verification:', error);
//         res.status(500).json({ error: 'An error occurred during form submission', details: error.message });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const upload = multer();
const { submitForm } = require('../controllers/formController'); // Adjust the path as necessary

// Secret key for reCAPTCHA v3 (replace with your actual secret key)
const secretKey = '6Lcz8I8qAAAAADvAu4IVZnhxGCpCt3Y8q3npNuWh'; 

// Route for form submission
router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';

    // Check if reCAPTCHA token is present
    if (!recaptchaResponse) {
        return res.status(400).json({ error: 'reCAPTCHA token missing' }); 
    }

    try {
        // Verify reCAPTCHA token with Google's API
        const recaptchaVerification = await axios.post(verificationURL, null, {
            params: {
                secret: secretKey,
                response: recaptchaResponse,
            },
        });

        console.log('reCAPTCHA verification response:', recaptchaVerification.data);

        // Check if reCAPTCHA verification was successful
        if (!recaptchaVerification.data.success) {
            return res.status(400).json({
                error: 'reCAPTCHA validation failed',
                details: recaptchaVerification.data['error-codes'],
            });
        }

        // Optional: Check the action and score
        const { action, score } = recaptchaVerification.data;
        if (action !== 'submit') {
            return res.status(400).json({ error: 'Invalid action in reCAPTCHA response' });
        }

        if (score < 0.5) {
            return res.status(400).json({
                error: 'Low reCAPTCHA score. Possible bot activity.',
                score,
            });
        }

        // Proceed with form submission logic
        await submitForm(req, res);
    } catch (error) {
        console.error('Error during reCAPTCHA verification:', error);
        res.status(500).json({ error: 'An error occurred during form submission', details: error.message });
    }
});

module.exports = router;


