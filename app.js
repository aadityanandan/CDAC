const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const formRoutes = require('./routes/formRoutes');
const csrfProtection = require('./routes/csrfProtection');
const connection = require('./config/db');
const otpRoutes = require('./routes/otpRoutes');
const authRoutes = require('./routes/authRoutes');


const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
// app.use(express.static('public'));
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



app.use(session({
    secret: process.env.SESSION_SECRET, // Use your securely generated secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 10 }, // 10 minutes
}));

app.use(cors());

// Routes
// app.use(csrfProtection);
app.use('/public',express.static('public'));
app.use('/', otpRoutes); 
app.use('/form', formRoutes);
// app.use('/', authRoutes);




module.exports = app;
