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
//Consultation by cour
async function findConsultationByCour(cour) {
  return Consultation.findAll({
    where: { cour },
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "matricule","escadron","peloton","numeroIncorporation"]
      },
      {
        model: Cadre,
        attributes: ["id", "nom", "grade","phone"]
      }
    ]
  });
}

// Mise à jour d'une consultation
async function updateConsultation(id, data) {
  return Consultation.update(data, { where: { id } });
}


module.exports = {
  createConsultation,
  findAllConsultations,
  deleteConsultation,
  findConsultationById,
  updateConsultation,
  findConsultationByCour
};
