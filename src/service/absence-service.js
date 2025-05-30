const Absence = require("../schemas/absence-schema");
const Eleve = require("../schemas/eleve-schema");

// Créer une absence
async function createAbsence(data) {
  if (Array.isArray(data)) {
    // Enregistrement multiple
    return await Absence.bulkCreate(data);
  } else {
    // Enregistrement simple
    return await Absence.create(data);
  }
}


// Obtenir toutes les absences
async function findAllAbsences() {
    return Absence.findAll({
      include: {
        model: Eleve,
        attributes: ["Id","nom", "prenom", "matricule", "escadron", "peloton","numeroIncorporation","cour"], 
      },
    });
  }

// Supprimer une absence par ID
async function deleteAbsence(id) {
  return Absence.destroy({ where: { id } });
}

// Obtenir les absences d'un élève donné 
async function findAbsencesByEleveId(eleveId) {
  return Absence.findAll({ where: { eleveId } });
}

module.exports = {
  createAbsence,
  findAllAbsences,
  deleteAbsence,
  findAbsencesByEleveId,
};
