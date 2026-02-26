const express = require('express');
const router = express.Router();
const upload = require('multer')(); // Middleware for handling form data
const vpnController = require('../controllers/vpnController')



router.get('/vpn', (req, res) => {
    res.render('dashboard/vpn'); 
});



router.post('/submit-vpn-endpoint', upload.none(), async (req, res) => {
    try {
        const { uuid } = await vpnController.submitVpnForm(req);

        // Send the redirect URL to the generated PDF
        res.status(200).json({ redirectUrl: `/generate-vpn-pdf/${uuid}` });
    } catch (error) {
        console.error('Error during VPN form submission:', error);
        res.status(500).json({ error: 'An error occurred while submitting the VPN form.' });
    }
});


module.exports = router;