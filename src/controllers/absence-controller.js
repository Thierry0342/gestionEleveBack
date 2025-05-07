const absenceService = require("../service/absence-service");

// Créer une absence
async function createAbsence(req, res) {
  try {
    const data = req.body;
    const newAbsence = await absenceService.createAbsence(data);
    res.status(201).json(newAbsence);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'absence" });
    console.log(error);
  }
}

// Lister toutes les absences
async function getAllAbsences(req, res) {
  try {
    const absences = await absenceService.findAllAbsences();
    res.json(absences);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des absences" });
    console.log(error);
  }
}

// Supprimer une absence par ID
async function deleteAbsence(req, res) {
  try {
    const id = req.params.id;
    await absenceService.deleteAbsence(id);
    res.status(200).json({ message: 'Absence supprimé' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'absence" });
  }
}

// Obtenir les absences par élève
async function getAbsencesByEleve(req, res) {
  try {
    const eleveId = req.params.eleveId;
    const absences = await absenceService.findAbsencesByEleveId(eleveId);
    res.json(absences);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des absences de l'élève" });
  }
}

module.exports = {
  createAbsence,
  getAllAbsences,
  deleteAbsence,
  getAbsencesByEleve,
};
