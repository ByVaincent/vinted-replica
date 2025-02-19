const express = require("express");
const router = express.Router();
const offerCtrl = require("../controllers/offer");

router.post("/offer/publish", offerCtrl.publishOffer);
router.post("/offer/update/:id", offerCtrl.updateOffer);
router.delete("/offer/delete/:id", offerCtrl.deleteOffer);

module.exports = router;
