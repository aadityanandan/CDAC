// const express = require("express");
// const router = express.Router();
// const upload = require("multer")();

// const decommissionController =
// require("../controllers/decommissionController");

// router.get("/", decommissionController.loadForm);

// router.post(
//     "/submit-decom-request",
//     upload.none(),
//     async (req,res)=>{
//         try{

//             const { uuid } =
//             await decommissionController.submitDecomForm(req);

//             /* ⭐ THIS ENDS THE REQUEST */
//             return res.status(200).json({
//                 redirectUrl:`/decommission-pdf/generate-decom-pdf/${uuid}`
//             });

//         }catch(err){
//             console.error(err);
//             return res.status(500).json({
//                 error:"Submission failed"
//             });
//         }
//     }
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("multer")();

const decommissionController =
require("../controllers/decommissionController");

router.get("/", decommissionController.loadForm);

router.post(
    "/submit-decom-request",
    upload.none(),
    async (req,res)=>{
        try{

            const { uuid } =
            await decommissionController.submitDecomForm(req);

            /* ⭐ THIS ENDS THE REQUEST */
            return res.status(200).json({
                redirectUrl:`/decommission-pdf/generate-decom-pdf/${uuid}`
            });

        }catch(err){
            console.error(err);
            return res.status(500).json({
                error:"Submission failed"
            });
        }
    }
);

module.exports = router;
