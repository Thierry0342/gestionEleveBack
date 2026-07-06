const Observation = require("../schemas/observation-schema");
const Eleve = require("../schemas/eleve-schema");

// Créer une observation (simple ou multiple)
async function createObservation(data) {
  if (Array.isArray(data)) {
    return await Observation.bulkCreate(data);
  } else {
    return await Observation.create(data);
  }
}

// Obtenir toutes les observations (avec info élève)
async function findAllObservations() {
  return Observation.findAll({
    include: {
      model: Eleve,
      attributes: [
        "Id", "nom", "prenom", "matricule",
        "escadron", "peloton", "numeroIncorporation", "cour",
      ],
    },
    order: [["id", "DESC"]],
  });
}

// Observations en masse, filtrées par incorporations ET par cours (comme sanctions/absences)
async function findObservationsByMultipleIncoporations(incorporations, cour) {
  const whereEleve = { numeroIncorporation: incorporations };
  if (cour) whereEleve.cour = cour;

  return Observation.findAll({
    include: {
      model: Eleve,
      where: whereEleve,
      attributes: ["id", "nom", "prenom", "matricule", "numeroIncorporation", "cour"],
    },
    order: [["id", "DESC"]],
  });
}

// Supprimer une observation par ID
async function deleteObservation(id) {
  return Observation.destroy({ where: { id } });
}

// Obtenir les observations d'un élève donné
async function findObservationsByEleveId(eleveId) {
  return Observation.findAll({ where: { eleveId }, order: [["id", "DESC"]] });
}

async function findObservationByNumeroIncorporation(numeroIncorporation, cour) {
  const whereEleve = { numeroIncorporation };
  if (cour) whereEleve.cour = cour;

  return Observation.findAll({
    include: [
      {
        model: Eleve,
        where: whereEleve,
        attributes: ["id", "nom", "prenom", "matricule", "numeroIncorporation", "cour"]
      },
    ],
    order: [["id", "DESC"]],
  });
}

// Mettre à jour une observation
async function updateObservation(id, payload) {
  const [count] = await Observation.update(payload, { where: { id } });
  if (!count) return null;
  return Observation.findByPk(id);
}

module.exports = {
  createObservation,
  findAllObservations,
  deleteObservation,
  findObservationsByEleveId,
  findObservationByNumeroIncorporation,
  findObservationsByMultipleIncoporations,
  updateObservation
};