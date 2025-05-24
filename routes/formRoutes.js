// Import necessary modules
const express = require('express');
const router = express.Router();
const upload = require('multer')(); // Middleware for handling form data
const formController = require('../controllers/formController');
const pdfController = require('../controllers/pdfController');


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










