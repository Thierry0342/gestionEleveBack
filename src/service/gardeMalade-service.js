const GardeMalade = require("../schemas/gardeMalade-schema");

// Créer
async function createGardeMalade(data) {
  return GardeMalade.create(data);
}

// Obtenir tous
async function findAllGardeMalade() {
  return GardeMalade.findAll({ order: [['id', 'DESC']] });
}

// Obtenir par ID
async function getGardeMaladeById(id) {
  return GardeMalade.findOne({ where: { id } });
}

// Supprimer
async function deleteGardeMalade(id) {
  return GardeMalade.destroy({ where: { id } });
}

// Mettre à jour
async function updateGardeMalade(id, data) {
  const garde = await GardeMalade.findByPk(id);
  if (!garde) return null;

  await garde.update(data);
  return garde;
}

module.exports = {
  createGardeMalade,
  findAllGardeMalade,
  getGardeMaladeById,
  deleteGardeMalade,
  updateGardeMalade,
};
