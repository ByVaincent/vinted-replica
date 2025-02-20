const express = require("express");
const router = express.Router();
const offerCtrl = require("../controllers/offer");
const fileUpload = require("express-fileupload");

router.post("/offer/publish", fileUpload(), offerCtrl.publishOffer);
router.put("/offer/update/:id", fileUpload(), offerCtrl.updateOffer);
router.delete("/offer/delete/:id", offerCtrl.deleteOffer);

module.exports = router;
