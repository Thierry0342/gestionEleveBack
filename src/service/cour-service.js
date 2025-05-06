const Cour = require("../schemas/cour-schema");

// Créer un cours
async function createCour(data) {
  return Cour.create(data);
}

// Obtenir tous les cours
async function findAllCours() {
  return Cour.findAll(); // trié si tu veux
}

async function deleteCour(id) {
    return Cour.destroy({ where: { id } }); // ✅ méthode Sequelize
  }

module.exports = {
  createCour,
  findAllCours,
  deleteCour
};
