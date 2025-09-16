const Patc = require("../schemas/patc-schema");
const Eleve = require("../schemas/eleve-schema");
const { Op } = require("sequelize");
// Créer un PATC
async function createPatc(data) {
  return Patc.create(data);
}

// Récupérer tous les PATC avec infos élèves si nécessaire
async function findAllPatc(includeEleve = false) {
  return Patc.findAll({
    include: includeEleve
      ? [
          {
            model: Eleve,
            attributes: ["id", "nom", "prenom", "numeroIncorporation", "escadron", "peloton", "cour"]
          }
        ]
      : []
  });
}

// Récupérer PATC par ID
async function findPatcById(id, includeEleve = false) {
  return Patc.findOne({
    where: { id },
    include: includeEleve
      ? [
          {
            model: Eleve,
            attributes: ["id", "nom", "prenom", "numeroIncorporation", "escadron", "peloton", "cour"]
          }
        ]
      : []
  });
}

// Récupérer PATC par cours
async function findPatcByCour(cour, includeEleve = false) {
  return Patc.findAll({
    where: { cour },
    include: includeEleve
      ? [
          {
            model: Eleve,
            attributes: ["id", "nom", "prenom", "numeroIncorporation", "escadron", "peloton", "cour"]
          }
        ]
      : []
  });
}

// Mettre à jour un PATC
async function updatePatc(id, data) {
  return Patc.update(data, { where: { id } });
}

// Supprimer un PATC
async function deletePatc(id) {
  return Patc.destroy({ where: { id } });
}

// Récupérer PATC par eleveId
async function findPatcByEleveId(eleveId, includeEleve = false) {
    return Patc.findAll({
      where: { eleveId },
      include: includeEleve
        ? [
            {
              model: Eleve,
              attributes: ["id", "nom", "prenom", "numeroIncorporation", "escadron", "peloton", "cour"]
            }
          ]
        : []
    });
  }
  async function findPatcByEleves(eleveIds) {
    return Patc.findAll({
      where: { eleveId: { [Op.in]: eleveIds } },
      include: [{ model: Eleve, attributes: ["id","nom","prenom","numeroIncorporation","escadron","peloton","cour"] }]
    });
  }
  
  
  module.exports = {
    createPatc,
    findAllPatc,
    findPatcById,
    findPatcByCour,
    updatePatc,
    deletePatc,
    findPatcByEleveId,
    findPatcByEleves
  };
