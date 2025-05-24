const express = require('express');
const router = express.Router();
const firewallPdfController = require('../controllers/firewallPdfController');
const connection = require('../config/db');


// Route for generating VPN PDF by UUID
router.get('/firewall-forms', async (req, res) => {
    try {
        const firewallForms = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM firewall_details', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        // Render the EJS page and pass the data
        res.render('dashboard/detailsFirewall', { firewallForms });
    } catch (error) {
        console.error('Error fetching VPN forms:', error);
        res.status(500).send('Could not load Firewall forms');
    }
});


router.get('/generate-firewall-pdf/:uuid', async (req, res) => {
    const { uuid } = req.params; // Extract UUID from URL parameter

    if (!uuid) {
        return res.status(400).send('UUID is required to generate the PDF.');
    }

    try {
        await firewallPdfController.generateFirewallPdfFromUuid(req, res);
    } catch (error) {
        console.error('Error generating VPN PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});




module.exports = router;

