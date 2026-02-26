const express = require('express');
const router = express.Router();
const firewallPdfController = require('../controllers/firewallPdfController');
const connection = require('../config/db'); // This is your promise-based pool

// Route for rendering firewall form data
router.get('/firewall-forms', async (req, res) => {
    try {
        // ✅ Use async/await with promise-based connection
        const [firewallForms] = await connection.query('SELECT * FROM firewall_details');

        // Render the EJS view with fetched data
        res.render('dashboard/detailsFirewall', { firewallForms });
    } catch (error) {
        console.error('❌ Error fetching Firewall forms:', error);
        res.status(500).send('Could not load Firewall forms');
    }
});

// Route for generating Firewall PDF by UUID
router.get('/generate-firewall-pdf/:uuid', async (req, res) => {
    const { uuid } = req.params;

    if (!uuid) {
        return res.status(400).send('UUID is required to generate the PDF.');
    }

    try {
        await firewallPdfController.generateFirewallPdfFromUuid(req, res);
    } catch (error) {
        console.error('❌ Error generating Firewall PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});

module.exports = router;




module.exports = router;

