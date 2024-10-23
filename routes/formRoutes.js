const express = require('express');
const router = express.Router();
const connection = require('../config/db');  // Use the database connection
const multer = require('multer');
const axios = require('axios');


// Example route using the connection
// router.post('/submit', (req, res) => {
//     const { name, email } = req.body;

//     const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
//     connection.query(query, [name, email], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.status(200).json({ message: 'Data inserted successfully' });
//     });
// });

const upload = multer();


router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
    // Extract form data from the request body
    const {deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed, appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo, concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup, vmInfo } = req.body;

    // Validate reCAPTCHA (assuming it's part of the form)
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const secretKey = '6LfFuWkqAAAAABEqRzDpdLf6pvkl7Tf8yWnUlZmv';  // Replace with your reCAPTCHA secret key
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    try {
        // Verify reCAPTCHA response with Google's API
        const recaptchaVerification = await axios.post(verificationURL);
        const { success } = recaptchaVerification.data;

        if (!success) {
            return res.status(400).send('reCAPTCHA validation failed');
        }

        // Now save the form data into the database
        const formData = {deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed, appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo, concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup, vmInfo };

        // Insert form data into your database (replace 'your_table' with your actual table name)
        connection.query('INSERT INTO form_data SET ?', formData, (error, results) => {
            if (error) {
                console.error('Database insertion error:', error);
                return res.status(500).send('Failed to save data');
            }

            // Respond with success if everything goes well
            res.status(200).send('Form submitted and data saved successfully!');
        });

    } catch (error) {
        console.error('Error during reCAPTCHA verification or database insertion:', error);
        res.status(500).send('An error occurred');
    }
});


module.exports = router;
