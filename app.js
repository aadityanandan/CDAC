const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer'); // Only if you need it
const cookieParser = require('cookie-parser');
// const csrf = require('csurf');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const formRoutes = require('./routes/formRoutes');
const otpRoutes = require('./routes/otpRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const downloadPdfRoute = require('./routes/pdfRoutes'); // Adjust path as necessary
// const authRoutes = require('./routes/authRoutes');
// const connection = require('./config/db');

// const csrfProtection = csrf({
//   cookie: true
// }); // Use cookies for CSRF tokens


require('dotenv').config();

const app = express();

// ** Configure Session Middleware **
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a securely generated secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to `true` if using HTTPS in production
      maxAge: 1000 * 60 * 10, // 10 minutes
    },
  })
);


// ** View Engine Setup **
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ** Middleware Setup **
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.json());

// app.use(express.static('public'));

// Static Routes for public files
app.use('/public', express.static('public')); // Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use(csrfProtection);


// ** CSRF Protection Middleware **

// app.use((req, res, next) => {
//   if (!req.session.csrfToken) {
// req.session.csrfToken = req.csrfToken(); // Generate and store token in session
//   }
//   res.locals.csrfToken = req.session.csrfToken; // Make it available to all views
// next();
// });

// app.use(csrfProtection, (req, res, next) => {
//   console.log(req.csrfToken());
//   next();
// });

// Handle CSRF errors globally
// app.use((err, req, res, next) => {
// if (err.code === 'EBADCSRFTOKEN') {
//   res.status(403).send('Invalid CSRF token.');
// } else {
//   next(err);
// }
// });


// ** Apply CSRF Middleware on Specific Routes **
// app.use('/form', csrfProtection, formRoutes); // Apply CSRF protection only to `/form`
app.use('/form', formRoutes);
app.use('/',  otpRoutes);
app.use('/', pdfRoutes);
// Export App
module.exports = app;