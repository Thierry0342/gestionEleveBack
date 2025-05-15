// src/routes/log-routes.js
const express = require("express");
const router = express.Router();
const logController = require("../controllers/log-controller"); // Import du contrôleur

// Créer un log
router.post("/", logController.createLog);

// Obtenir tous les logs
router.get("/", logController.findAllLogs);

// Supprimer un log par ID
router.delete("/:id", logController.deleteLog);

// Obtenir un log par ID
router.get("/:id", logController.getLogById);

// Mettre à jour un log par ID
router.put("/:id", logController.updateLog);

module.exports = router;
