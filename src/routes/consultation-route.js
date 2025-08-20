const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation-controller");

router.post("/", consultationController.createConsultation);              
router.get("/", consultationController.getAllConsultations);              
router.get("/:id", consultationController.getConsultationById);           
router.delete("/:id", consultationController.deleteConsultation); 
router.get("/eleve/:eleveId", consultationController.getConsultationsByEleveId);       
router.put("/:id", consultationController.updateConsultation);
router.get("/cour/:id", consultationController.getfindConsultationByCour);             

module.exports = router;
