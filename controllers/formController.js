// const {v4: uuidv4} = require('uuid'); // Import uuid library
// const connection = require('../config/db'); // Import the database connection


// exports.submitForm = (req, res) => {
//     const uuid = uuidv4(); // Generate unique identifier

//     if (!req.body) {
//         return res.status(400).json({ error: 'Request body is missing' });
//     }

//     // Destructure fields from the request body and provide defaults for arrays
//     const {
//         deploymentType,
//         appName,
//         appDetails,
//         langUsed,
//         dbUsed,
//         frameworkUsed,
//         appType,
//         deptName,
//         deptEmail,
//         deptPhNum,
//         deptAddrs,
//         concurrentUsers,
//         peakTime,
//         loadBalance,
//         ipv6Compatibility,
//         tapeBackup,
//         contactName = [], // Default to empty array if undefined
//         contactEmail = [],
//         contactPhNum = [],
//         contactDesignation = [],
//         contactRole = [],
//         vmName = [],
//         vmType =[],
//         coresCount = [],
//         servicesVersions = [],
//         osVersion = [],
//         storage = []
//     } = req.body;

//     // Validate required fields
//     if (!deploymentType || !appName || !appDetails || !langUsed || !dbUsed || !frameworkUsed || !appType) {
//         return res.status(400).json({ error: 'Missing required fields in Hosting Info' });
//     }
//     if (!deptName || !deptEmail || !deptPhNum || !deptAddrs) {
//         return res.status(400).json({ error: 'Missing required fields in Department Info' });
//     }

//     // Construct contactInfo and vmInfo arrays with additional validation
//     try {
//         const contactInfo = contactName.map((name, index) => ({
//             contactName: name,
//             contactEmail: contactEmail[index] || null,
//             contactPhNum: contactPhNum[index] || null,
//             contactDesignation: contactDesignation[index] || null,
//             contactRole: contactRole[index] || null,
//         }));

//         const vmInfo = vmName.map((name, index) => ({
//             vmName: name,
//             vmType: vmType[index] || null,
//             coresCount: coresCount[index] || null,
//             servicesVersions: servicesVersions[index] || null,
//             osVersion: osVersion[index] || null,
//             storage: storage[index] || null,
//         }));

//         // Insert data into the database
//         const hostingQuery = `
//             INSERT INTO hosting_details (
//                 deploymentType, uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const hostingValues = [
//             deploymentType, uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
//         ];

//         connection.query(hostingQuery, hostingValues, (err, hostingResults) => {
//             if (err) {
//                 console.error('Error inserting into hosting_details:', err);
//                 return res.status(500).json({
//                     error: 'Error saving hosting details',
//                     details: err.message
//                 });
//             }

//             const departmentQuery = `
//                 INSERT INTO department_details (deptName, deptEmail, deptPhNum, deptAddrs, uuid)
//                 VALUES (?, ?, ?, ?, ?)
//             `;
//             const departmentValues = [deptName, deptEmail, deptPhNum, deptAddrs, uuid];

//             connection.query(departmentQuery, departmentValues, (err, departmentResults) => {
//                 if (err) {
//                     console.error('Error inserting into department_details:', err);
//                     return res.status(500).json({
//                         error: 'Error saving department details',
//                         details: err.message
//                     });
//                 }

//                 const contactQuery = `
//                     INSERT INTO contact_details (contactName, contactEmail, contactPhNum, contactDesignation, contactRole, uuid)
//                     VALUES (?, ?, ?, ?, ?, ?)
//                 `;
//                 const contactPromises = contactInfo.map(contact => {
//                     const contactValues = [
//                         contact.contactName, contact.contactEmail, contact.contactPhNum, contact.contactDesignation, contact.contactRole, uuid
//                     ];
//                     return new Promise((resolve, reject) => {
//                         connection.query(contactQuery, contactValues, (err, result) => {
//                             if (err) {
//                                 console.error("Error inserting contact info:", err);
//                                 return reject(err);
//                             }
//                             resolve(result);
//                         });
//                     });
//                 });

//                 const additionalQuery = `
//                     INSERT INTO additional_info (
//                         concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup
//                     ) VALUES (?, ?, ?, ?, ?, ?)
//                 `;
//                 const additionalValues = [
//                     concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup
//                 ];

//                 const additionalPromise = new Promise((resolve, reject) => {
//                     connection.query(additionalQuery, additionalValues, (err, result) => {
//                         if (err) {
//                             console.error("Error inserting additional info:", err);
//                             return reject(err);
//                         }
//                         resolve(result);
//                     });
//                 });

//                 const vminfoQuery = `
//                     INSERT INTO vm_details (vmName, vmType,  coresCount, servicesVersions, osVersion, storage, uuid)
//                     VALUES (?, ?, ?, ?, ?, ?, ?)
//                 `;
//                 const vmPromises = vmInfo.map(vm => {
//                     const vminfoValues = [
//                         vm.vmName, vm.vmType,  vm.coresCount, vm.servicesVersions, vm.osVersion, vm.storage, uuid
//                     ];
//                     return new Promise((resolve, reject) => {
//                         connection.query(vminfoQuery, vminfoValues, (err, result) => {
//                             if (err) {
//                                 console.error("Error inserting VM info:", err);
//                                 return reject(err);
//                             }
//                             resolve(result);
//                         });
//                     });
//                 });

//                 // Execute all inserts simultaneously
//                 Promise.all([...contactPromises, additionalPromise, ...vmPromises])
//                     .then(results => {
//                         res.status(200).json({
//                             message: 'Form data saved successfully across multiple tables with UUID',
//                             uuid: uuid,
//                             data: {
//                                 hostingDetails: hostingResults,
//                                 departmentDetails: departmentResults,
//                                 contactDetails: results.slice(0, contactPromises.length),
//                                 additionalDetails: results[contactPromises.length],
//                                 vminfoDetails: results.slice(contactPromises.length + 1)
//                             }
//                         });
//                     })
//                     .catch(error => {
//                         console.error('Error inserting data:', error);
//                         res.status(500).json({
//                             error: 'Error saving form data',
//                             details: error.message
//                         });
//                     });
//             });
//         });
//     } catch (error) {
//         console.error('Error constructing contact or VM info:', error);
//         res.status(500).json({ error: 'Invalid form data', details: error.message });
//     }
// };










const { v4: uuidv4 } = require('uuid');
const connection = require('../config/db');

exports.submitForm = async (req) => {
    const uuid = uuidv4();

    if (!req.body) {
        throw new Error('Request body is missing');
    }

    const {
        deploymentType,
        appName,
        appDetails,
        langUsed,
        dbUsed,
        frameworkUsed,
        appType,
        deptName,
        deptEmail,
        deptPhNum,
        deptAddrs,
        concurrentUsers,
        peakTime,
        loadBalance,
        ipv6Compatibility,
        tapeBackup,
        contactName = [],
        contactEmail = [],
        contactPhNum = [],
        contactDesignation = [],
        contactRole = [],
        vmName = [],
        vmType = [],
        coresCount = [],
        servicesVersions = [],
        osVersion = [],
        storage = []
    } = req.body;

    if (!deploymentType || !appName || !appDetails || !langUsed || !dbUsed || !frameworkUsed || !appType) {
        throw new Error('Missing required fields in Hosting Info');
    }
    if (!deptName || !deptEmail || !deptPhNum || !deptAddrs) {
        throw new Error('Missing required fields in Department Info');
    }

    const contactInfo = contactName.map((name, index) => ({
        contactName: name,
        contactEmail: contactEmail[index] || null,
        contactPhNum: contactPhNum[index] || null,
        contactDesignation: contactDesignation[index] || null,
        contactRole: contactRole[index] || null,
    }));

    const vmInfo = vmName.map((name, index) => ({
        vmName: name,
        vmType: vmType[index] || null,
        coresCount: coresCount[index] || null,
        servicesVersions: servicesVersions[index] || null,
        osVersion: osVersion[index] || null,
        storage: storage[index] || null,
    }));

    const hostingQuery = `
        INSERT INTO hosting_details (
            deploymentType, uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const hostingValues = [
        deploymentType, uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
    ];

    await new Promise((resolve, reject) => {
        connection.query(hostingQuery, hostingValues, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const departmentQuery = `
        INSERT INTO department_details (deptName, deptEmail, deptPhNum, deptAddrs, uuid)
        VALUES (?, ?, ?, ?, ?)
    `;
    const departmentValues = [deptName, deptEmail, deptPhNum, deptAddrs, uuid];

    await new Promise((resolve, reject) => {
        connection.query(departmentQuery, departmentValues, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const contactQuery = `
        INSERT INTO contact_details (contactName, contactEmail, contactPhNum, contactDesignation, contactRole, uuid)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await Promise.all(contactInfo.map(contact => {
        const contactValues = [
            contact.contactName, contact.contactEmail, contact.contactPhNum, contact.contactDesignation, contact.contactRole, uuid
        ];
        return new Promise((resolve, reject) => {
            connection.query(contactQuery, contactValues, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }));

    const additionalQuery = `
        INSERT INTO additional_info (
            concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const additionalValues = [
        concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup
    ];
    await new Promise((resolve, reject) => {
        connection.query(additionalQuery, additionalValues, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const vminfoQuery = `
        INSERT INTO vm_details (vmName, vmType, coresCount, servicesVersions, osVersion, storage, uuid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await Promise.all(vmInfo.map(vm => {
        const vminfoValues = [
            vm.vmName, vm.vmType, vm.coresCount, vm.servicesVersions, vm.osVersion, vm.storage, uuid
        ];
        return new Promise((resolve, reject) => {
            connection.query(vminfoQuery, vminfoValues, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }));

    return { uuid };
};













