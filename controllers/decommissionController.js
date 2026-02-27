// const connection = require('../config/db');


// exports.loadForm = (req, res) => {
//     res.render("dashboard/decommission");
// };
//    function generateCustomUUID() {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');
//     return `${day}${month}${year}-${hours}${minutes}${seconds}`;
// }

// exports.submitDecomForm = async (req) => {

//     if (!req.body || Object.keys(req.body).length === 0) {
//         throw new Error("Request body missing");
//     }
    
 

//     const uuid = generateCustomUUID();

//     const data = req.body;

//     const insertQuery = `
//         INSERT INTO decom_requests (
//             uuid, action, department, address, admin_head, reason,
//             vm_name_decom, private_ip_decom, public_ip_decom,
//             vm_name_increase, vcpus_increase, ram_increase, storage_increase,
//             vm_name_decrease, vcpus_decrease, ram_decrease, storage_decrease
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     await new Promise((resolve, reject) => {
//         connection.query(insertQuery, [
//             uuid,
//             data.action,
//             data.department,
//             data.address,
//             data.adminHead,
//             data.reason,

//             data.vmName_decom,
//             data.privateIp_decom,
//             data.publicIp_decom,

//             data.vmName_increase,
//             data.vcpus_increase,
//             data.ram_increase,
//             data.storage_increase,

//             data.vmName_decrease,
//             data.vcpus_decrease,
//             data.ram_decrease,
//             data.storage_decrease
//         ], (err) => {
//             if (err) return reject(err);
//             resolve();
//         });
//     });

//     return { uuid };
// };

const connection = require('../config/db');

function generateCustomUUID() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2,'0');
    const month = String(now.getMonth()+1).padStart(2,'0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');

    return `${day}${month}${year}-${hours}${minutes}${seconds}`;
}

exports.loadForm = (req,res)=>{
    res.render("dashboard/decommission");
};

exports.submitDecomForm = async (req) => {

    if (!req.body || Object.keys(req.body).length === 0)
        throw new Error("Request body missing");

    const uuid = generateCustomUUID();
    const data = req.body;

    const query = `
        INSERT INTO decom_requests(
            uuid, action, department, address, admin_head, reason,
            vm_name_decom, private_ip_decom, public_ip_decom,
            vm_name_increase, vcpus_increase, ram_increase, storage_increase,
            vm_name_decrease, vcpus_decrease, ram_decrease, storage_decrease
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(query,[
        uuid,
        data.action,
        data.department,
        data.address,
        data.adminHead,
        data.reason,
        data.vmName_decom,
        data.privateIp_decom,
        data.publicIp_decom,
        data.vmName_increase,
        data.vcpus_increase,
        data.ram_increase,
        data.storage_increase,
        data.vmName_decrease,
        data.vcpus_decrease,
        data.ram_decrease,
        data.storage_decrease
    ]);

    return { uuid };
};
