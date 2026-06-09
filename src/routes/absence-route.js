const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absence-controller");

router.post("/", absenceController.createAbsence);
router.get("/", absenceController.getAllAbsences);
router.get("/eleve/:eleveId", absenceController.getAbsencesByEleve);
router.get("/incorp/:numeroIncorporation", absenceController.getAbsenceByNumeroIncorporation);
router.delete("/:id", absenceController.deleteAbsence);
router.post("/bulk", absenceController.getAbsencesByMultipleIncoporations);

module.exports = router;