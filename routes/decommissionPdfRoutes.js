// const express = require('express');
// const router = express.Router();

// const decommissionPdfController =
// require('../controllers/decommissionPdfController');
// console.log("Controller Loaded:", decommissionPdfController);
// const connection = require('../config/db');

// /* ================= LIST PAGE ================= */
// router.get('/decommission-forms', async (req, res) => {
//     try {

//         const [decomForms] =
//             await connection.query(
//                 'SELECT * FROM decom_requests ORDER BY submitted_at DESC'
//             );

//         res.render('dashboard/detailsDecommission', {
//             decomForms
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Could not load Decommission forms');
//     }
// });

// /* ================= PDF ================= */
// router.get(
//     '/generate-decom-pdf/:uuid',
//     async (req, res) => {
//         return decommissionPdfController
//             .generateDecomPdfFromUuid(req, res);
//     }
// );

// module.exports = router;


const express = require('express');
const router = express.Router();

const decommissionPdfController =
require('../controllers/decommissionPdfController');

router.get(
    '/generate-decom-pdf/:uuid',
    decommissionPdfController.generateDecomPdfFromUuid
);

module.exports = router;