// src/controllers/log-controller.js
const logService = require("../service/logs-service"); // Import du service log

// Créer un log
async function createLog(req, res) {
  try {
    const { userId, action, details, timestamp } = req.body;
    const newLog = await logService.createLog({ userId, action, details, timestamp });
    res.status(201).json(newLog);
  } catch (err) {
    console.error("Erreur lors de la création du log :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Obtenir tous les logs
async function findAllLogs(req, res) {
  try {
    const logs = await logService.findAllLogs();
    res.status(200).json(logs);
  } catch (err) {
    console.error("Erreur lors de la récupération des logs :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Supprimer un log par ID
async function deleteLog(req, res) {
  try {
    const logId = req.params.id;
    await logService.deleteLog(logId);
    res.status(204).json({ message: "Log supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du log :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Obtenir un log par ID
async function getLogById(req, res) {
  try {
    const logId = req.params.id;
    const log = await logService.getLogById(logId);
    if (!log) {
      return res.status(404).json({ error: "Log non trouvé" });
    }
    res.status(200).json(log);
  } catch (err) {
    console.error("Erreur lors de la récupération du log par ID :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Mettre à jour un log par ID
async function updateLog(req, res) {
  try {
    const logId = req.params.id;
    const { action, details } = req.body;
    const updatedLog = await logService.updateLog(logId, { action, details });
    res.status(200).json(updatedLog);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du log :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

module.exports = {
  createLog,
  findAllLogs,
  deleteLog,
  getLogById,
  updateLog,
};
