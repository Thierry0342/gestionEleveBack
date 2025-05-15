// src/routes/log-routes.js
const express = require("express");
const router = express.Router();
const spaSpecialeController = require("../controllers/spaSpeciale-controller"); // Import du contrôleur


router.post("/", spaSpecialeController.createSpa);


router.get("/", spaSpecialeController.getSpaSpeciale);


router.delete("/:id", spaSpecialeController.deleteSpa);



router.put("/:id", spaSpecialeController.update);

module.exports = router;
