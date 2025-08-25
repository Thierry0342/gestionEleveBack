const Sanction = require("../schemas/sanctions-schemas");
const Eleve = require("../schemas/eleve-schema");

// Créer une sanction (simple ou multiple)
async function createSanction(data) {
  if (Array.isArray(data)) {
    return await Sanction.bulkCreate(data);
  } else {
    return await Sanction.create(data);
  }
}

// Obtenir toutes les sanctions (avec info élève)
async function findAllSanctions() {
  return Sanction.findAll({
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
//
// Supprimer une sanction par ID
async function deleteSanction(id) {
  return Sanction.destroy({ where: { id } });
}

// Obtenir les sanctions d'un élève donné
async function findSanctionsByEleveId(eleveId) {
  return Sanction.findAll({ where: { eleveId } });
}

// (Optionnel) Mettre à jour une sanction
async function updateSanction(id, payload) {
  const [count] = await Sanction.update(payload, { where: { id } });
  if (!count) return null;
  return Sanction.findByPk(id, {
    include: {
      model: Eleve,
      attributes: [
        "Id", "nom", "prenom", "matricule",
        "escadron", "peloton", "numeroIncorporation", "cour",
      ],
    },
  });
}

module.exports = {
  createSanction,
  findAllSanctions,
  deleteSanction,
  findSanctionsByEleveId,
  updateSanction, // <- retire si tu ne veux pas d’update
};
