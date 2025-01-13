// const express = require('express');
// const router = express.Router();
// const multer = require('multer'); // Import multer
// const upload = multer(); // Initialize multer
// const formController = require('../controllers/formController'); // Import your form controller
// const pdfController = require('../controllers/pdfController'); // Import your Pdf controller



// router.post('/submit-form-endpoint', upload.none(), formController.submitForm);

// router.post('/submit-form', upload.none(), async (req, res) => {
//     try {
//         // Save form data to the database
//         const { uuid } = await formController.submitForm(req, res);

//         // Redirect the user to the download page with UUID
//         res.redirect(`/download-pdf?uuid=${uuid}`);
//     } catch (error) {
//         console.error('Error during form submission:', error);
//         res.status(500).send('An error occurred while submitting the form.');
//     }
// });

// Import necessary modules
const express = require('express');
const router = express.Router();
const upload = require('multer')(); // Middleware for handling form data
const formController = require('../controllers/formController');
const pdfController = require('../controllers/pdfController');

// Form submission route
// router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
//     try {
//         // Save form data to the database and get the UUID
//         const { uuid } = await formController.submitForm(req, res);

//         // Redirect the user to the PDF download page using the UUID
//         res.redirect(`/download-pdf?uuid=${uuid}`);
// console.log(`Redirecting to /download-pdf?uuid=${uuid}`);

//     } catch (error) {
//         console.error('Error during form submission:', error);
//         res.status(500).send('An error occurred while submitting the form.');
//     }
// });

router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
    try {
        const { uuid } = await formController.submitForm(req, res);

        // Send the redirect URL as JSON
        res.status(200).json({ redirectUrl: `/download-pdf?uuid=${uuid}` });
    } catch (error) {
        console.error('Error during form submission:', error);
        res.status(500).json({ error: 'An error occurred while submitting the form.' });
    }
});


// PDF download route
router.get('/download-pdf', async (req, res) => {
    try {
        const { uuid } = req.query;

        if (!uuid) {
            return res.status(400).send('Missing UUID for PDF download.');
        }

        // Generate and send the PDF for the given UUID
        await pdfController.generatePdfFromUuid(uuid, res);
    } catch (error) {
        console.error('Error during PDF generation:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});

module.exports = router;





