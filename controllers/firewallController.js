const connection = require('../config/db');

function generateCustomUUID() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}${month}${year}-${hours}${minutes}${seconds}`;
}

exports.submitFirewallForm = async (req) => {
    if (!req.body) {
        throw new Error('Request body is missing');
    }

    const uuid = generateCustomUUID();

    const {
        appName, url, privateIpAddrss, publicIpAddrss,
        name, email, contactNum,
        from = [], to = [], portNum = [], serviceReq = [], reqDetails = [],
        acceptTerms
    } = req.body;

    // Validation
    if (!appName || !url || !privateIpAddrss || !publicIpAddrss) {
        throw new Error('Missing required general details');
    }
    if (!name || !email || !contactNum) {
        throw new Error('Missing required requestor details');
    }
    if (!acceptTerms) {
        throw new Error('Terms and Conditions must be accepted');
    }

    // Convert arrays to comma-separated strings
    const mergedFrom = from.join(',');
    const mergedTo = to.join(',');
    const mergedPortNum = portNum.join(',');
    const mergedServiceReq = serviceReq.join(',');
    const mergedReqDetails = reqDetails.join(',');

    const insertQuery = `
        INSERT INTO firewall_details (
            uuid, appName, url, privateIpAddrss, publicIpAddrss,
            name, email, contactNum, \`from\`, \`to\`, portNum, serviceReq, reqDetails
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        uuid, appName, url, privateIpAddrss, publicIpAddrss,
        name, email, contactNum, mergedFrom, mergedTo, mergedPortNum, mergedServiceReq, mergedReqDetails
    ];

    try {
        await new Promise((resolve, reject) => {
            connection.query(insertQuery, values, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        return { message: 'Firewall Request submitted successfully', uuid };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to submit Firewall request');
    }
};
