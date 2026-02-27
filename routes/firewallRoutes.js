
const express = require('express');
const router = express.Router();
const upload = require('multer')(); // Middleware for handling form data
const firewallController = require('../controllers/firewallController')




router.get('/', (req, res) => {
    res.render('dashboard/firewall');
});




router.post('/submit-firewall-endpoint', upload.none(), async (req, res) => {
    try {
        const {uuid} = await firewallController.submitFirewallForm(req); // Call your Firewall form handling function

// Send the redirect URL to the generated PDF
res.status(200).json({ redirectUrl: `/generate-firewall-pdf/${uuid}` });
} catch (error) {
    console.error('Error during Firewall form submission:', error);
    res.status(500).json({ error: 'An error occurred while submitting the Firewall form.' });
}
});


module.exports = router;








