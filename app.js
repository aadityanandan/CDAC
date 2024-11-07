const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const formRoutes = require('./routes/formRoutes');
// const authRoutes = require('./routes/authRoutes');
const homeRouter = require('./routes/home');
const csrfProtection = require('./routes/process');
const connection = require('./config/db');
// const authController = require('./controllers/authController');
const otpRoutes = require('./routes/otpRoutes');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// CSRF Protection
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('Form tampered with.');
    } else {
        next(err);
    }
});
app.use(express.json());

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
// app.use('/auth', authRoutes);  // Authentication routes
app.use('/form', formRoutes);  // Form-related routes
app.use('/home', homeRouter);
app.use('/otp', otpRoutes);    // Use the OTP routes
app.use('/', csrfProtection);
app.use(cors());

module.exports = app;
