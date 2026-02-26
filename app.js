const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const formRoutes = require('./routes/formRoutes');
const otpRoutes = require('./routes/otpRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const firewallRoutes = require('./routes/firewallRoutes');
const vpnPdfRoutes = require('./routes/vpnPdfRoutes');
const firewallPdfRoutes = require('./routes/firewallPdfRoutes');
const landingPageRoutes = require('./routes/landingPageRoutes');
const decommissionRoutes = require("./routes/decommissionRoutes");

require('dotenv').config();
const db = require('./config/db'); 

const app = express();


// ** Configure Session Middleware **
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Set to true if using HTTPS in production
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Static Routes
app.use(express.static(path.join(__dirname, 'public')));


// ** Application Routes **
app.use('/', otpRoutes);
app.use('/', pdfRoutes);
app.use('/', detailsRoutes);
app.use('/', vpnRoutes);
app.use('/', firewallRoutes);
app.use('/', vpnPdfRoutes);
app.use('/', firewallPdfRoutes);
app.use('/', landingPageRoutes);
app.use('/form', formRoutes);
app.use("/decommission", decommissionRoutes);

module.exports = app;
