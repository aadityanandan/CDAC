const { v4: uuidv4 } = require('uuid');  // Import uuid library
const connection = require('../config/db');  // Import the database connection

exports.submitForm = (req, res) => {
    const uuid = uuidv4(); // Generate unique identifier

    const {
        deploymentType, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType,
        deptName, deptEmail, deptPhNum, deptAddrs,
        concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup,
    } = req.body;

// Construct contactInfo and vmInfo arrays if they come as individual arrays
const contactInfo = req.body.contactName.map((name, index) => ({
    contactName: name,
    contactEmail: req.body.contactEmail[index],
    contactPhNum: req.body.contactPhNum[index],
    contactDesignation: req.body.contactDesignation[index],
    contactRole: req.body.contactRole[index]
}));

const vmInfo = req.body.vmName.map((name, index) => ({
    vmName: name,
    cpuCount: req.body.cpuCount[index],
    servicesVersions: req.body.servicesVersions[index],
    osVersion: req.body.osVersion[index],
    storage: req.body.storage[index]
}));

    const hostingQuery = `
        INSERT INTO hosting_details (
            deploymentType, uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const hostingValues = [
        deploymentType, uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
    ];

    connection.query(hostingQuery, hostingValues, (err, hostingResults) => {
        if (err) {
            console.error('Error inserting into hosting_details:', err);
            return res.status(500).json({ error: 'Error saving hosting details', details: err.message });
        }

        const departmentQuery = `
            INSERT INTO department_details (deptName, deptEmail, deptPhNum, deptAddrs, uuid)
            VALUES (?, ?, ?, ?, ?)
        `;
        const departmentValues = [deptName, deptEmail, deptPhNum, deptAddrs, uuid];

        connection.query(departmentQuery, departmentValues, (err, departmentResults) => {
            if (err) {
                console.error('Error inserting into department_details:', err);
                return res.status(500).json({ error: 'Error saving department details', details: err.message });
            }

            const contactQuery = `
                INSERT INTO contact_details (contactName, contactEmail, contactPhNum, contactDesignation, contactRole, uuid)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const contactPromises = contactInfo.map(contact => {
                const contactValues = [
                    contact.contactName, contact.contactEmail, contact.contactPhNum, contact.contactDesignation, contact.contactRole, uuid
                ];
                return new Promise((resolve, reject) => {
                    connection.query(contactQuery, contactValues, (err, result) => {
                        if (err) {
                            console.error("Error inserting contact info:", err);
                            return reject(err);
                        }
                        resolve(result);
                    });
                });
            });

            const additionalQuery = `
                INSERT INTO additional_info (
                    concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;
            const additionalValues = [
                concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup
            ];

            const additionalPromise = new Promise((resolve, reject) => {
                connection.query(additionalQuery, additionalValues, (err, result) => {
                    if (err) {
                        console.error("Error inserting additional info:", err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            const vminfoQuery = `
                INSERT INTO vm_details (vmName, cpuCount, servicesVersions, osVersion, storage, uuid)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const vmPromises = vmInfo.map(vm => {
                const vminfoValues = [
                    vm.vmName, vm.cpuCount, vm.servicesVersions, vm.osVersion, vm.storage, uuid
                ];
                return new Promise((resolve, reject) => {
                    connection.query(vminfoQuery, vminfoValues, (err, result) => {
                        if (err) {
                            console.error("Error inserting VM info:", err);
                            return reject(err);
                        }
                        resolve(result);
                    });
                });
            });

            // Execute all inserts simultaneously
            Promise.all([...contactPromises, additionalPromise, ...vmPromises])
                .then(results => {
                    res.status(200).json({
                        message: 'Form data saved successfully across multiple tables with UUID',
                        uuid: uuid,
                        data: {
                            hostingDetails: hostingResults,
                            departmentDetails: departmentResults,
                            contactDetails: results.slice(0, contactPromises.length),
                            additionalDetails: results[contactPromises.length],
                            vminfoDetails: results.slice(contactPromises.length + 1)
                        }
                    });
                })
                .catch(error => {
                    console.error('Error inserting data:', error);
                    res.status(500).json({ error: 'Error saving form data', details: error.message });
                });
        });
    });
};
