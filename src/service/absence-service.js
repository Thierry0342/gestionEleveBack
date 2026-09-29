const Absence = require("../schemas/absence-schema");
const Eleve = require("../schemas/eleve-schema");
const { Op } = require("sequelize");

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
//
async function findAbsencesHistoriqueByEleveId(eleveId) {
  const eleve = await Eleve.findByPk(eleveId);
  if (!eleve) return [];

  const liens = [];
  if (eleve.CIN && String(eleve.CIN).trim())             liens.push({ CIN: eleve.CIN });
  if (eleve.matricule && String(eleve.matricule).trim()) liens.push({ matricule: eleve.matricule });
  if (liens.length === 0) return [];

  const where = { id: { [Op.ne]: eleve.id }, [Op.or]: liens };
  if (eleve.cour) where.cour = { [Op.lt]: eleve.cour };

  const anciens = await Eleve.findAll({
    where,
    attributes: ["id", "cour", "numeroIncorporation", "escadron", "peloton"],
    order: [["cour", "ASC"]],
  });
  if (anciens.length === 0) return [];

  const absences = await Absence.findAll({
    where: { eleveId: anciens.map(a => a.id) },
    order: [["date", "ASC"]],
  });

  return anciens
    .map(a => ({
      cour: a.cour,
      numeroIncorporation: a.numeroIncorporation,
      escadron: a.escadron,
      peloton: a.peloton,
      absences: absences.filter(x => x.eleveId === a.id),
    }))
    .filter(b => b.absences.length > 0);
}

// Obtenir toutes les absences
async function findAllAbsences() {
    return Absence.findAll({
      include: {
        model: Eleve,
        attributes: ["Id","nom", "prenom", "matricule", "escadron", "peloton","numeroIncorporation","cour","image"], 
      },
    });
  }
 async function findAbsencesByMultipleIncoporations(incorporations, cour) {
    const whereEleve = { numeroIncorporation: incorporations };
    if (cour) whereEleve.cour = cour;  

    return Absence.findAll({
        include: [
            {
                model: Eleve,
                where: whereEleve,
                attributes: ["id", "nom", "prenom", "matricule", "numeroIncorporation", "image"]
            }
        ]
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
async function findAbsenceByNumeroIncorporation(numeroIncorporation) {
  return Absence.findAll({
    include: [
      {
        model: Eleve,
        where: { numeroIncorporation },
        attributes: ["id", "nom", "prenom", "matricule", "numeroIncorporation","image"]
      },
  
    ],
   
  });
}

module.exports = {
  createAbsence,
  findAllAbsences,
  deleteAbsence,
  findAbsencesByEleveId,
  findAbsenceByNumeroIncorporation,
  findAbsencesByMultipleIncoporations,
  findAbsencesHistoriqueByEleveId
};
