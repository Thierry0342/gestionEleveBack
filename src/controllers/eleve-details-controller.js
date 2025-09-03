// controllers/eleve-details-controller.js
const eleveDetailsService = require("../service/eleve-details-service");

async function getEleveDetailsBatch(req, res) {
    try {
      const ids = (req.body.ids || []).map(Number).filter(Boolean);
      if (!ids.length) return res.status(400).json({ error: "No IDs provided" });
  
      const details = await eleveDetailsService.findDetailsByEleveIds(ids);
      res.json(details);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des détails des élèves" });
    }
  }
  
module.exports = { getEleveDetailsBatch };
