
const express = require('express');
const pdfController = require('../controllers/pdfController'); // Update path as needed
const router = express.Router();

router.get('/generate-pdf', async (req, res) => {
    const { uuid } = req.query;

    if (!uuid) {
        return res.status(400).send('UUID is required to generate the PDF.');
    }

    try {
        // Generate and send the PDF
        await pdfController.generatePdfFromUuid(uuid, res);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});

module.exports = router;
