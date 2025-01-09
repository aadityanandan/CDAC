const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const upload = multer(); // Initialize multer
const formController = require('../controllers/formController'); // Import your form controller
const pdfController = require('../controllers/pdfController'); // Import your Pdf controller



// router.post('/submit-form-endpoint', upload.none(), formController.submitForm);

router.post('/submit-form-endpoint', upload.none(), async (req, res) => {
    try {
        // Step 1: Handle form submission
        await formController.submitForm(req, res);

        // Step 2: Generate and download the PDF
        pdfController.generatePdf(req, res);
    } catch (error) {
        console.error('Error during form submission or PDF generation:', error);
        res.status(500).send('An error occurred.');
    }
});



module.exports = router;


