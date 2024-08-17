
const express = require('express');
const sendMail = require('./mailer'); // Import the mailer module

const app = express();
const port = 5000;

app.use(express.static('public'));
app.use(express.json()); // Middleware to parse JSON bodies

// POST route to verify SMTP configuration
app.post('/verify-email-server', (req, res) => {
    sendMail.verifySMTP((error, success) => {
        if (error) {
            res.status(500).json({ message: 'Error verifying SMTP configuration', error });
        } else {
            res.status(200).json({ message: 'Server is ready to take our messages' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server successful, listening on port ${port}`);
});
