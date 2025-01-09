// routes/pdfRoutes.js

const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.post('/generate-pdf', pdfController.generatePdf);

module.exports = router;
