


const express = require('express');
const router = express.Router();
const vpnPdfController = require('../controllers/vpnPdfController');
const connection = require('../config/db'); // This is your promise-based pool
console.log('DB type:', connection.constructor.name);
// Route for generating VPN PDF by UUID
router.get('/vpn-forms', async (req, res) => {
    try {
        const [vpnForms] = await connection.query('SELECT * FROM vpn_details');

        // Render the EJS page and pass the data
        res.render('dashboard/detailsVpn', { vpnForms });
    } catch (error) {
        console.error('❌ Error fetching VPN forms:', error);
        res.status(500).send('Could not load VPN forms');
    }
});

router.get('/generate-vpn-pdf/:uuid', async (req, res) => {
    const { uuid } = req.params;

    if (!uuid) {
        return res.status(400).send('UUID is required to generate the PDF.');
    }

    try {
        await vpnPdfController.generateVpnPdfFromUuid(req, res);
    } catch (error) {
        console.error('❌ Error generating VPN PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});

module.exports = router;

