const connection = require('../config/db'); 
exports.submitForm = (req, res) => {
    const {
        deploymentType, appName, appDetails, langUsed, dbUsed, frameworkUsed,
        appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo, concurrentUsers, peakTime, loadBalance,
        ipv6Compatibility, tapeBackup, vmInfo
    } = req.body;

    const query = `
        INSERT INTO form_data (
            deploymentType, appName, appDetails, langUsed, dbUsed, frameworkUsed,
            appType, deptName, deptEmail, deptPhNum, deptAddrs, contactInfo,
            concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup, 
             vmInfo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        deploymentType, appName, appDetails, langUsed, dbUsed, frameworkUsed,
        appType, deptName, deptEmail, deptPhNum, deptAddrs,
        JSON.stringify(contactInfo), concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup
        , JSON.stringify(vmInfo)
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
