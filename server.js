
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling form data
const authRoutes = require('./auth');

const app = express();
const db = require('./db'); // Import the MySQL connection

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.json());

app.use('/auth', authRoutes);

// Use multer to handle form data (optional, if you have file uploads)
const upload = multer();

app.post('/api/submit-form', upload.none(), (req, res) => {
    const {
        deploymentType,
        appName,
        appdetails,
        langUsed,
        dbUsed,
        frameworkUsed,
        appType,
        deptName,
        deptEmail,
        deptPhNum,
        deptAddrs,
        contactInfo,
        additionalInfo,
        vmInfo
    } = req.body;

    // Prepare SQL query
    const query = `
        INSERT INTO form_data (
            deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
            appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo,
            additionalInfo, vmInfo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        deploymentType,
        appName,
        appdetails,
        langUsed,
        dbUsed,
        frameworkUsed,
        JSON.stringify(appType), // JSON stringify if storing as JSON
        deptName,
        deptEmail,
        deptPhNum,
        deptAddrs,
        JSON.stringify(contactInfo),
        JSON.stringify(additionalInfo),
        JSON.stringify(vmInfo)
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error saving form data');
            return;
        }
        res.status(200).send('Form data received and saved');
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
