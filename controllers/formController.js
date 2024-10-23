// const connection = require('../config/db');

// exports.submitForm = (req, res) => {
//     const {
//         deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
//         appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo,
//         additionalInfo, vmInfo
//     } = req.body;

//     const query = `
//         INSERT INTO form_data (
//             deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
//             appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo,
//             additionalInfo, vmInfo
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//         deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
//         JSON.stringify(appType), deptName, deptEmail, deptPhNum, deptAddrs,
//         JSON.stringify(contactInfo), JSON.stringify(additionalInfo), JSON.stringify(vmInfo)
//     ];

//     connection.query(query, values, (err, results) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             res.status(500).send('Error saving form data');
//             return;
//         }
//         res.status(200).send('Form data received and saved');
//     });
// };


const connection = require('../config/db'); 
exports.submitForm = (req, res) => {
    const {
        deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
        appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo, concurrentUsers, peakTime, loadBalance,
        ipv6Compatibility, tapeBackup, additionalInfo, vmInfo
    } = req.body;

    const query = `
        INSERT INTO form_data (
            deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
            appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo,
            concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup, 
            additionalInfo, vmInfo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        deploymentType, appName, appdetails, langUsed, dbUsed, frameworkUsed,
        appType, deptName, deptEmail, deptPhNum, deptAddrs,
        JSON.stringify(contactInfo), concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup,
        JSON.stringify(additionalInfo), JSON.stringify(vmInfo)
    ];

    connection.query(query, values, (err, results) => { 
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error saving form data', details: err.message });
            return;
        }
        res.status(200).json({ message: 'Form data received and saved successfully', data: results });
    });
};
