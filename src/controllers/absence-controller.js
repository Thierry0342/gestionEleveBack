const absenceService = require("../service/absence-service");

// Créer une absence
async function createAbsence(req, res) {
  try {
    const data = req.body;

    // Si c'est un tableau, on enregistre tous
    const result = await absenceService.createAbsence(data);

    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur lors de la création de l'absence:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'absence" });
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
//by incorporation
async function getAbsenceByNumeroIncorporation(req, res) {
  try {
    const numeroIncorporation = req.params.numeroIncorporation;

    const consultations = await absenceService.findAbsenceByNumeroIncorporation(numeroIncorporation);

    if (!consultations || consultations.length === 0) {
      return res.status(404).json({ error: "Aucune Absence trouvée" });
    }

    res.json(consultations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la recherche" });
  }
}

module.exports = {
  createAbsence,
  getAllAbsences,
  deleteAbsence,
  getAbsencesByEleve,
  getAbsenceByNumeroIncorporation
};
