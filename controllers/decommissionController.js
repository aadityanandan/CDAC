const connection = require("../config/db");

/* Load Page */
exports.loadForm = (req, res) => {
    res.render("dashboard/decommission");
};

/* Submit Form */
exports.submitDecomForm = async (req) => {

    if (!req.body) {
        throw new Error("Request body missing");
    }
    
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

    const uuid = generateCustomUUID();

    const {
        action,
        department,
        address,
        adminHead,
        reason,
        vmName_decom,
        privateIp_decom,
        publicIp_decom,
        vmName_increase,
        vcpus_increase,
        ram_increase,
        storage_increase,
        vmName_decrease,
        vcpus_decrease,
        ram_decrease,
        storage_decrease
    } = req.body;

    if (!action || !department || !address || !adminHead) {
        throw new Error("Missing required fields");
    }

    const insertQuery = `
        INSERT INTO decom_requests (
            uuid, action, department, address, admin_head, reason,
            vm_name_decom, private_ip_decom, public_ip_decom,
            vm_name_increase, vcpus_increase, ram_increase, storage_increase,
            vm_name_decrease, vcpus_decrease, ram_decrease, storage_decrease
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
        connection.query(insertQuery, [
            uuid, action, department, address, adminHead, reason,
            vmName_decom, privateIp_decom, publicIp_decom,
            vmName_increase, vcpus_increase, ram_increase, storage_increase,
            vmName_decrease, vcpus_decrease, ram_decrease, storage_decrease
        ], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    return { uuid };
};
