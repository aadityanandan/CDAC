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

exports.submitVpnForm = async (req) => {
    if (!req.body) {
        throw new Error('Request body is missing');
    }

    const uuid = generateCustomUUID();

    const {
        Name,
        Designation,
        Email,
        phoneNumber,
        deptName,
        deptState,
        deptPhNum,
        deptAddrs,
        serverIP = [],
        serverLocation = [],
        serverPort = [],
        serverDescription = [],
    } = req.body;

    if (!Name || !Designation || !Email || !phoneNumber) {
        throw new Error('Missing required personal details');
    }
    if (!deptName || !deptState || !deptPhNum || !deptAddrs) {
        throw new Error('Missing required department details');
    }

    const connectionPromise = (query, values) => {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    };

    try {
        // 🧠 Merge dynamic arrays into comma-separated strings
        const mergedServerIP = serverIP.join(',');
        const mergedServerLocation = serverLocation.join(',');
        const mergedServerPort = serverPort.join(',');
        const mergedServerDescription = serverDescription.join(',');

        const insertQuery = `
            INSERT INTO vpn_details (
                uuid, Name, Designation, Email, phoneNumber,
                deptName, deptState, deptPhNum, deptAddrs,
                serverIP, serverLocation, serverPort, serverDescription
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connectionPromise(insertQuery, [
            uuid, Name, Designation, Email, phoneNumber,
            deptName, deptState, deptPhNum, deptAddrs,
            mergedServerIP, mergedServerLocation, mergedServerPort, mergedServerDescription
        ]);

        return { message: 'VPN Details submitted successfully', uuid };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to submit VPN details');
    }
    return { uuid };
};
