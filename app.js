
const express =require('express');
const axios = require('axios');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;
const authRoutes = require('./auth'); // Import the auth routes

app.use(express.static('public'));
app.use(express.static('view'));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); //Middleware to parse cookie
// const csrfProtection = csrf({ cookie: true });


const homeRouter = require('./routes/home'); 

const csrfProtection = require('./routes/process');



// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Use the CSRF protection on routes where you want to protect against CSRF attacks
// app.get('/process', csrfProtection, (req, res) => {
//     // Pass the CSRF token to the form view
//     res.send(req.csrfToken());
//     res.render('public/index', { csrfToken: req.csrfToken() });
// });
app.set('view engine', 'ejs');



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
 app.use("/home", homeRouter);

 app.use("/", csrfProtection);



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
