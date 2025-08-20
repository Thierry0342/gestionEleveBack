const express = require("express");
const router = express.Router();
const sanctionController = require("../controllers/sanctions-controller");

router.post("/", sanctionController.createSanction);
router.get("/", sanctionController.getAllSanctions);
router.get("/eleve/:eleveId", sanctionController.getSanctionsByEleve);
router.delete("/:id", sanctionController.deleteSanction);
// (Optionnel) route d’update
router.put("/:id", sanctionController.updateSanction);

module.exports = router;
