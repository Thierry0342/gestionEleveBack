const gardeMaladeService = require("../service/gardeMalade-service");

// Obtenir tous les garde-malades
exports.getAllGardeMalade = async (req, res) => {
  try {
    const gardes = await gardeMaladeService.findAllGardeMalade();
    res.json(gardes);
  } catch (err) {
    console.error("Erreur getAllGardeMalade:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Obtenir par ID
exports.getGardeMalade = async (req, res) => {
  try {
    const garde = await gardeMaladeService.getGardeMaladeById(req.params.id);
    if (!garde) return res.status(404).json({ error: "Garde malade non trouvé" });

    res.json(garde);
  } catch (err) {
    console.error("Erreur getGardeMalade:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un garde malade
exports.createGardeMalade = async (req, res) => {
  try {
    const { nom, matricule, grade, service, phone } = req.body;

    if (!nom || !matricule) {
      return res.status(400).json({ error: "Nom et matricule sont requis" });
    }

    const newGarde = await gardeMaladeService.createGardeMalade({
      nom,
      matricule,
      grade,
      service,
      phone,
    });

    res.status(201).json(newGarde);
  } catch (err) {
    console.error("Erreur createGardeMalade:", err);
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};

// Supprimer
exports.deleteGardeMalade = async (req, res) => {
  try {
    await gardeMaladeService.deleteGardeMalade(req.params.id);
    res.json({ message: "Garde malade supprimé" });
  } catch (err) {
    console.error("Erreur deleteGardeMalade:", err);
    res.status(400).json({ error: "Erreur lors de la suppression" });
  }
};

// Mettre à jour
exports.updateGardeMalade = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await gardeMaladeService.updateGardeMalade(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Garde malade non trouvé" });
    }
    res.json({ message: "Garde malade mis à jour", gardeMalade: updated });
  } catch (err) {
    console.error("Erreur updateGardeMalade:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};
