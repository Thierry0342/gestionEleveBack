const express = require("express");
const router = express.Router();
const observationController = require("../controllers/observation-controller");

router.post("/", observationController.createObservation);
router.post("/bulk", observationController.getObservationsByMultipleIncoporations);
router.get("/", observationController.getAllObservations);
router.get("/eleve/:eleveId", observationController.getObservationsByEleve);
router.get("/incorp/:numeroIncorporation", observationController.getObservationByNumeroIncorporation);
router.put("/:id", observationController.updateObservation);
router.delete("/:id", observationController.deleteObservation);

module.exports = router;