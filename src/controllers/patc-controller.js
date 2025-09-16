const patcService = require("../service/patc-service");

// Créer un PATC
async function createPatc(req, res) {
  try {
    const data = req.body;
    const newPatc = await patcService.createPatc(data);
    res.status(201).json(newPatc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du PATC" });
  }
}

// Récupérer tous les PATC
async function getAllPatc(req, res) {
  try {
    const includeEleve = req.query.includeEleve === "true"; // optionnel
    const patcs = await patcService.findAllPatc(includeEleve);
    res.json(patcs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des PATC" });
  }
}

// Supprimer un PATC
async function deletePatc(req, res) {
  try {
    const id = req.params.id;
    await patcService.deletePatc(id);
    res.status(200).json({ message: "PATC supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression du PATC" });
  }
}

// Récupérer un PATC par ID
async function getPatcById(req, res) {
  try {
    const id = req.params.id;
    const includeEleve = req.query.includeEleve === "true";
    const patc = await patcService.findPatcById(id, includeEleve);
    if (patc) {
      res.json(patc);
    } else {
      res.status(404).json({ error: "PATC non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du PATC" });
  }
}

// Récupérer PATC par cours
async function getPatcByCour(req, res) {
  try {
    const cour = req.params.id;
    const includeEleve = req.query.includeEleve === "true";
    const patcs = await patcService.findPatcByCour(cour, includeEleve);
    if (patcs && patcs.length > 0) {
      res.json(patcs);
    } else {
      res.status(404).json({ error: "Aucun PATC trouvé pour ce cours" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des PATC par cours" });
  }
}

// Mettre à jour un PATC
async function updatePatc(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    await patcService.updatePatc(id, data);
    res.status(200).json({ message: "PATC mis à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du PATC" });
  }
}

// Récupérer PATC par eleveId
async function getPatcByEleveId(req, res) {
    try {
      const eleveId = req.params.eleveId;
      const includeEleve = req.query.includeEleve === "true";
      const patcs = await patcService.findPatcByEleveId(eleveId, includeEleve);
      res.json(patcs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des PATC pour cet élève" });
    }
  }
  // patc-controller.js
async function getPatcByEleves(req, res) {
    try {
      const eleveIds = req.body.eleveIds; // tableau d'IDs
      const patcs = await patcService.findPatcByEleves(eleveIds);
      res.json(patcs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des PATC" });
    }
  }
  // Récupérer les PATC pour plusieurs élèves en un seul appel
  exports.getPatcByEleves = async (req, res) => {
    try {
      const { eleveIds } = req.body;
  
      if (!eleveIds || !Array.isArray(eleveIds)) {
        return res.status(400).json({ message: "Liste eleveIds invalide" });
      }
  
      const patcs = await patcService.findPatcByEleves(eleveIds);
  
      // Regrouper par eleveId
      const patcMap = eleveIds.reduce((acc, id) => {
        acc[id] = patcs.filter(p => p.eleveId === id);
        return acc;
      }, {});
  
      res.json(patcMap);
    } catch (error) {
      console.error("Erreur getPatcByEleves:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  
  module.exports = {
    createPatc,
    getAllPatc,
    deletePatc,
    getPatcById,
    updatePatc,
    getPatcByCour,
    getPatcByEleveId,
    getPatcByEleves
  };