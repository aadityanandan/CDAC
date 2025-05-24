const express = require("express");
const router = express.Router();
const detailsController = require("../controllers/detailsController");
const pdfController = require("../controllers/pdfController");

// Route to fetch data and render page
router.get("/hosting-forms", detailsController.getSubmittedForms);

// Route to just render the page without data
router.get("/submitted-form", (req, res) => {
    res.render("dashboard/details", { forms: [] }); // Pass empty array to avoid "undefined" error
});



router.get('/generate-pdf/:uuid', async (req, res) => {
    const { uuid } = req.params; // Extract UUID from URL parameter

    if (!uuid) {
        return res.status(400).send('UUID is required to generate the PDF.');
    }

    try {
        await pdfController.generatePdfFromUuid(uuid, res);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});

module.exports = router;
