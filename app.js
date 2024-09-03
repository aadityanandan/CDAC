

    // Assuming you're using something like body-parser to parse the form data
//     const sql = `INSERT INTO form_data (column1, column2, column3, ...) VALUES (?, ?, ?, ...)`;

//     db.query(sql, [formData.field1, formData.field2, formData.field3,] (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             res.status(500).send('Failed to save data.');
//         }
//         else{
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
const express = require('express');
const sendMail = require('./mailer'); // Import the mailer module
const authRoutes = require('./auth'); // Import the auth routes
const axios = require('axios');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;


app.use(express.static('public'));
app.use(express.static('view'));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); //Middleware to parse cookie

// Setup CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Use the CSRF protection on routes where you want to protect against CSRF attacks
app.get('/form', csrfProtection, (req, res) => {
    // Pass the CSRF token to the form view
    //res.send(req.csrfToken());
    res.render('public/index', { csrfToken: req.csrfToken() });
});

app.post('/process', csrfProtection, (req, res) => {
    // Process the form data
    res.send('Form processed successfully.');
});

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // CSRF token validation failed
        res.status(403);
        res.send('Form tampered with.');
    } else {
        next(err);
    }
});


app.post('/submit-form-endpoint', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];

    // Verify the reCAPTCHA response with Google's API
    const secretKey = '6LePUzUqAAAAACn3uL5vANK2JVECdWvfiXIciVgH';
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    try {
        const response = await axios.post(verificationURL);
        const { success } = response.data;

        if (success) {
            // reCAPTCHA verification succeeded
            console.log(req.body);  // Log the received data
            res.send('Form submitted successfully!');
        } else {
            // reCAPTCHA verification failed
            res.status(400).send('reCAPTCHA failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during reCAPTCHA verification:', error);
        res.status(500).send('An error occurred during reCAPTCHA verification.');
    }
});
// Use the auth routes
app.use('/auth', authRoutes);

app.post('/submit-form-endpoint', (req, res) => {
    console.log(req.body);  // Log the received data
    res.send('Form submitted successfully!');
});
 
// Start the server
app.listen(port, () => {
    console.log(`Server successful, listening on port ${port}`);
});
