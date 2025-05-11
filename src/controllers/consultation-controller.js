const consultationService = require("../service/consultation-service");

// Créer une consultation
async function createConsultation(req, res) {
  try {
    const data = req.body;
    const newConsultation = await consultationService.createConsultation(data);
    res.status(201).json(newConsultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la consultation" });
  }
}

// Obtenir toutes les consultations avec les données élève et cadre
async function getAllConsultations(req, res) {
  try {
    const consultations = await consultationService.findAllConsultations();
    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des consultations" });
  }
}

// Supprimer une consultation par ID
async function deleteConsultation(req, res) {
  try {
    const id = req.params.id;
    await consultationService.deleteConsultation(id);
    res.status(200).json({ message: "Consultation supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la consultation" });
  }
}

// Obtenir une consultation par ID avec les jointures
async function getConsultationById(req, res) {
  try {
    const id = req.params.id;
    const consultation = await consultationService.findConsultationById(id);
    if (consultation) {
      res.json(consultation);
    } else {
      res.status(404).json({ error: "Consultation non trouvée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération de la consultation" });
  }
}
async function getfindConsultationByCour(req, res) {
  try {
    const cour = req.params.id;
    console.log("cour ve ee",cour);
    const consultation = await consultationService.findConsultationByCour(cour);
    if (consultation) {
      res.json(consultation);
    } else {
      res.status(404).json({ error: "Consultation non trouvée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération de la consultation" });
  }
}

// Mettre à jour une consultation
async function updateConsultation(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    await consultationService.updateConsultation(id, data);
    res.status(200).json({ message: "Consultation mise à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la consultation" });
  }
}

module.exports = {
  createConsultation,
  getAllConsultations,
  deleteConsultation,
  getConsultationById,
  updateConsultation,
  getfindConsultationByCour
};
