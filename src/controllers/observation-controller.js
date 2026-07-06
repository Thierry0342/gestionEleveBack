const observationService = require("../service/observation-service");

// Créer une observation
async function createObservation(req, res) {
  try {
    const data = req.body;
    const result = await observationService.createObservation(data);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création de l'observation:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'observation" });
  }
}

// Lister toutes les observations
async function getAllObservations(req, res) {
  try {
    const observations = await observationService.findAllObservations();
    res.json(observations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des observations" });
  }
}

// Observations en masse (filtrées par cours, comme pour les sanctions)
async function getObservationsByMultipleIncoporations(req, res) {
  try {
    const { incorporations, cour } = req.body;

    if (!Array.isArray(incorporations) || incorporations.length === 0) {
      return res.status(400).json({ error: "Liste d'incorporations requise." });
    }

    const observations = await observationService.findObservationsByMultipleIncoporations(incorporations, cour);
    res.json(observations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des observations bulk." });
  }
}

// Supprimer une observation par ID
async function deleteObservation(req, res) {
  try {
    const id = req.params.id;
    await observationService.deleteObservation(id);
    res.status(200).json({ message: "Observation supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'observation" });
  }
}

// Obtenir les observations d'un élève
async function getObservationsByEleve(req, res) {
  try {
    const eleveId = req.params.eleveId;
    const observations = await observationService.findObservationsByEleveId(eleveId);
    res.json(observations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des observations de l'élève" });
  }
}

// Par numéro d'incorporation
async function getObservationByNumeroIncorporation(req, res) {
  try {
    const numeroIncorporation = req.params.numeroIncorporation;
    const cour = req.query.cour; // 
    const observations = await observationService.findObservationByNumeroIncorporation(numeroIncorporation, cour);
    res.json(observations || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la recherche" });
  }
}

// Mettre à jour une observation
async function updateObservation(req, res) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await observationService.updateObservation(id, payload);
    if (!updated) {
      return res.status(404).json({ error: "Observation introuvable" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'observation:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'observation" });
  }
}

module.exports = {
  createObservation,
  getAllObservations,
  deleteObservation,
  getObservationsByEleve,
  getObservationByNumeroIncorporation,
  getObservationsByMultipleIncoporations,
  updateObservation
};