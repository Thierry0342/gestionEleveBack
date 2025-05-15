const { Model } = require("sequelize");
const Log = require("../schemas/logs-schema");  // Le modèle Sequelize Log
const User = require ("../schemas/user-schema")
// Créer un log
async function createLog(userId, action, details = '') {
    try {
      const log = await Log.create({
        userId,
        action,
        details,
      });
      console.log(`Log créé pour l'utilisateur ${userId}, action: ${action}`);
      return log;
    } catch (error) {
      console.error('Erreur lors de la création du log:', error);
      throw new Error('Erreur lors de la création du log');
    }
  }
  
// Obtenir tous les logs
async function findAllLogs() {
  try {
    return await Log.findAll({
      include :[
        {
          model:User,
          attributes:['username']

        }
      ]
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des logs :", err);
    throw new Error("Erreur de récupération des logs");
  }
}

// Supprimer un log par ID
async function deleteLog(id) {
  try {
    return await Log.destroy({ where: { id } });
  } catch (err) {
    console.error("Erreur de suppression de log :", err);
    throw new Error("Erreur de suppression du log");
  }
}

// Obtenir un log par ID
async function getLogById(id) {
  try {
    return await Log.findOne({ where: { id } });
  } catch (err) {
    console.error("Erreur de récupération du log par ID :", err);
    throw new Error("Erreur de récupération du log");
  }
}

// Mettre à jour un log par ID
async function updateLog(id, data) {
  try {
    return await Log.update(data, { where: { id } });
  } catch (err) {
    console.error("Erreur de mise à jour du log :", err);
    throw new Error("Erreur de mise à jour du log");
  }
}

module.exports = {
  createLog,
  findAllLogs,
  deleteLog,
  getLogById,
  updateLog
};
