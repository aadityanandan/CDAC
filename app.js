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
const signupRoutes = require('./routes/signupRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const firewallRoutes = require('./routes/firewallRoutes');
const vpnPdfRoutes = require('./routes/vpnPdfRoutes');
const firewallPdfRoutes = require('./routes/firewallPdfRoutes');
const landingPageRoutes = require('./routes/landingPageRoutes');

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



// Static Routes for public files
app.use('/public', express.static('public')); // Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));





app.use('/', formRoutes);
app.use('/', otpRoutes);
app.use('/', pdfRoutes);
app.use('/signup', signupRoutes);
app.use('/', detailsRoutes);
app.use('/', vpnRoutes);
app.use('/', firewallRoutes);
app.use('/', vpnPdfRoutes);
app.use('/', firewallPdfRoutes);
app.use('/', landingPageRoutes);



// Export App
module.exports = app;