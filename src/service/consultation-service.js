const Consultation = require("../schemas/consultation-schema");
const Eleve = require("../schemas/eleve-schema");
const Cadre = require("../schemas/cadre-schema");

// Créer une consultation
async function createConsultation(data) {
  return Consultation.create(data);
}

// Obtenir toutes les consultations avec les données des élèves et des cadres
async function findAllConsultations() {
  return Consultation.findAll({
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "numeroIncorporation","escadron","peloton"]
      },
      {
        model: Cadre,
        attributes: ["id", "nom","prenom", "grade","phone","service"]
      }
    ]
  });
}

// Supprimer une consultation par ID
async function deleteConsultation(id) {
  return Consultation.destroy({ where: { id } });
}

// Obtenir une consultation par ID (avec jointure)
async function findConsultationById(id) {
  return Consultation.findOne({
    where: { id },
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "matricule"]
      },
      {
        model: Cadre,
        attributes: ["id", "nom", "grade"]
      }
    ]
  });
}
//
async function findConsultationByNumeroIncorporation(numeroIncorporation) {
  return Consultation.findAll({
    include: [
      {
        model: Eleve,
        where: { numeroIncorporation },
        attributes: ["id", "nom", "prenom", "matricule", "numeroIncorporation","image"]
      },
      {
        model: Cadre,
        attributes: ["id", "nom", "grade"]
      }
    ],
    order: [["dateDepart", "DESC"]]
  });
}

//Consultation by cour
async function findConsultationByCour(cour) {
  return Consultation.findAll({
    where: { cour },
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "matricule","escadron","peloton","numeroIncorporation","image"]
      },
      {
        model: Cadre,
        attributes: ["id", "nom", "grade","phone","service"]
      }
    ]
  });
}

// Mise à jour d'une consultation
// Mise à jour d'une consultation
async function updateConsultation(id, data) {
  await Consultation.update(data, { where: { id } });

  // Retourne la nouvelle version actualisée
  return Consultation.findOne({ where: { id } });
}

async function findConsultationsByEleveId(eleveId) {
  return Consultation.findAll({
    where: { eleveId },
    include: [
      { model: Eleve, attributes: ["id","nom","prenom","numeroIncorporation","escadron","peloton"] },
      { model: Cadre, attributes: ["id","nom","prenom","grade","phone","service"] }
    ],
    order: [["id","DESC"]],
  });
}

module.exports = {
  createConsultation,
  findAllConsultations,
  deleteConsultation,
  findConsultationById,
  updateConsultation,
  findConsultationByCour,
  findConsultationsByEleveId,
  findConsultationByNumeroIncorporation
};
