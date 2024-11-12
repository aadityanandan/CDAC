// const express = require('express');
// const router = express.Router();
// const connection = require('../config/db');  // Use the database connection
// const multer = require('multer');
// const axios = require('axios');
// const upload = multer();


// router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
//     // Extract form data from the request body
//     const { deploymentType, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo, concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup, vmInfo } = req.body;

//     // console.log("deploymentType =>" + deploymentType);
//     // console.log("appdetails => " + appdetails);
//     // console.log("appdetails1 => " + appdetails1); return true;

//     // Validate reCAPTCHA (assuming it's part of the form)
//     const recaptchaResponse = req.body['g-recaptcha-response'];
//     const secretKey = '6LfFuWkqAAAAAHv6yI3n8wtSRFMy0NagLqY8Rfqb';  // Replace with your reCAPTCHA secret key
//     const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;


//     try {
//         // Verify reCAPTCHA response with Google's API
//         const recaptchaVerification = await axios.post(verificationURL);
//         const { success } = recaptchaVerification.data;


//         if (!success) {
//             return res.status(400).send('reCAPTCHA validation failed');
//         }

//         // Now save the form data into the database
//         // const formData = { deploymentType, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo, concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup, vmInfo };

//         // console.log(formData);

//         // // Insert form data into your database (replace 'your_table' with your actual table name)
//         // connection.query('INSERT INTO form_data SET ?', formData, (error, results) => {                  
//         //     if (error) {
//         //         console.error('Database insertion error:', error);
//         //         return res.status(500).send('Failed to save data');
//         //     }

//         //     // Respond with success if everything goes well
//         //     res.status(200).send('Form submitted and data saved successfully!');
//         // });

//     } catch (error) {
//         console.error('Error during reCAPTCHA verification or database insertion:', error);
//         res.status(500).send('An error occurred');
//     }
// });


// module.exports = router;



// // const express = require('express');
// // const router = express.Router();
// // const multer = require('multer');
// // const axios = require('axios');
// // const { submitForm } = require('../controllers/formController'); // Import the controller function
// // const upload = multer();

// // router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
// //     // Extract reCAPTCHA response
// //     const recaptchaResponse = req.body['g-recaptcha-response'];
// //     const secretKey = '6LfFuWkqAAAAAHv6yI3n8wtSRFMy0NagLqY8Rfqb';  // Replace with your reCAPTCHA secret key
// //     const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

// //     try {
// //         // Verify reCAPTCHA response with Google’s API
// //         const recaptchaVerification = await axios.post(verificationURL);
// //         const { success } = recaptchaVerification.data;

// //         if (!success) {
// //             return res.status(400).json({ error: 'reCAPTCHA validation failed' });
// //         }

// //         // Pass the request and response to the submitForm controller
// //         submitForm(req, res);

// //     } catch (error) {
// //         console.error('Error during reCAPTCHA verification:', error);
// //         res.status(500).json({ error: 'An error occurred during form submission' });
// //     }
// // });

// // module.exports = router;







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
