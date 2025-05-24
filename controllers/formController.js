const connection = require('../config/db');
const uuid = generateCustomUUID();


function generateCustomUUID() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}${month}${year}-${hours}${minutes}${seconds}`;
}


exports.submitForm = async (req) => {

    if (!req.body) {
        throw new Error('Request body is missing');
    }

    const {
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

    if (!appName || !appDetails || !langUsed || !dbUsed || !frameworkUsed || !appType) {
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
            uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const hostingValues = [
        uuid, appName, appDetails, langUsed, dbUsed, frameworkUsed, appType
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













