const express = require('express');
const router = express.Router();
const upload = require('multer')(); // Middleware for handling form data
const formController = require('../controllers/formController');
const pdfController = require('../controllers/pdfController');

// ✅ Form submission route (controller handles response)
router.post('/submit-form-endpoint', upload.none(), formController.submitForm);

// ✅ PDF download route
router.get('/generate-pdf', async (req, res) => {
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


