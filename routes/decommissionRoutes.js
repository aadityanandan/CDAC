const express = require("express");
const router = express.Router();
const upload = require("multer")();

const decommissionController = require("../controllers/decommissionController");

/* LOAD PAGE */
router.get("/", decommissionController.loadForm);

/* SUBMIT FORM */
router.post(
    "/submit-decom-request",
    upload.none(),
    async (req, res) => {
        try {
            const { uuid } = await decommissionController.submitDecomForm(req);

            res.status(200).json({
                redirectUrl: `/decommission-success/${uuid}`
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to submit Decommission form"
            });
        }
    }
);

module.exports = router;
