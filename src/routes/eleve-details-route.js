// routes/eleve-details-route.js
const express = require("express");
const router = express.Router();
const eleveDetailsController = require("../controllers/eleve-details-controller");

router.post("/details", eleveDetailsController.getEleveDetailsBatch);
router.get("/details", eleveDetailsController.getEleveDetailsBatch); // si tu veux garder GET



module.exports = router;
