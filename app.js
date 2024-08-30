
const express = require('express');

const sendMail = require('./mailer'); // Import the mailer module

const app = express();

const port = 5000;

app.use(express.static('public'));

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/submit-form-endpoint', (req, res) => {
    console.log(req.body);  // Log the received data
    res.send('Form submitted successfully!');
});

// app.post('/submit-form-endpoint', (req, res) => {
//     const formData = req.body;

//     // Assuming you're using something like body-parser to parse the form data
//     const sql = `INSERT INTO form_data (column1, column2, column3, ...) VALUES (?, ?, ?, ...)`;

//     db.query(sql, [formData.field1, formData.field2, formData.field3,] (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             res.status(500).send('Failed to save data.');
//         } else {
//             res.status(200).send('Data saved successfully.');
//         }
//     });
// });




// POST route to verify SMTP configuration
// app.post('/verify-email-server', (req, res) => {
//     sendMail.verifySMTP((error, success) => {
//         if (error) {
//             res.status(500).json({ message: 'Error verifying SMTP configuration', error });
//         } else {
//             res.status(200).json({ message: 'Server is ready to take our messages' });
//         }
//     });
// });

// Start the server
app.listen(port, () => {
    console.log(`Server successful, listening on port ${port}`);
});
