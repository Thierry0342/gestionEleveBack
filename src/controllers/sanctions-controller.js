const sanctionService = require("../service/sanctions-service");

// Créer une sanction
async function createSanction(req, res) {
  try {
    const data = req.body;
    const result = await sanctionService.createSanction(data);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création de la sanction:", error);
    res.status(500).json({ error: "Erreur lors de la création de la sanction" });
  }
}

// Lister toutes les sanctions
async function getAllSanctions(req, res) {
  try {
    const sanctions = await sanctionService.findAllSanctions();
    res.json(sanctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des sanctions" });
  }
}

// Supprimer une sanction par ID
async function deleteSanction(req, res) {
  try {
    const id = req.params.id;
    await sanctionService.deleteSanction(id);
    res.status(200).json({ message: "Sanction supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la sanction" });
  }
}

// Obtenir les sanctions par élève
async function getSanctionsByEleve(req, res) {
  try {
    const eleveId = req.params.eleveId;
    const sanctions = await sanctionService.findSanctionsByEleveId(eleveId);
    res.json(sanctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des sanctions de l'élève" });
  }
}

// (Optionnel) Mettre à jour une sanction
async function updateSanction(req, res) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await sanctionService.updateSanction(id, payload);
    if (!updated) {
      return res.status(404).json({ error: "Sanction introuvable" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la sanction:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la sanction" });
  }
}

module.exports = {
  createSanction,
  getAllSanctions,
  deleteSanction,
  getSanctionsByEleve,
  updateSanction, // <- retire si tu ne veux pas d’update
};
