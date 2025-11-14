const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation-controller");
router.post("/", consultationController.createConsultation);
router.get("/", consultationController.getAllConsultations);

router.get("/cour/:id", consultationController.getfindConsultationByCour);
router.get("/eleve/:eleveId", consultationController.getConsultationsByEleveId);
router.get("/incorp/:numeroIncorporation", consultationController.getConsultationByNumeroIncorporation);

router.get("/:id", consultationController.getConsultationById);
router.delete("/:id", consultationController.deleteConsultation);
router.put("/:id", consultationController.updateConsultation);

module.exports = router;
