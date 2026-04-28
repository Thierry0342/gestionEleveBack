const Specialite = require("../schemas/specialite-schema");

async function create(data, options = {}) {
  return Specialite.create(data, options);
}

async function bulkCreate(data, options = {}) {
  return Specialite.bulkCreate(data, options);
}

async function findByEleveId(eleveId) {
  return Specialite.findAll({
    where: { eleveId },
    order: [['createdAt', 'ASC']],
  });
}

async function findByPk(id) {
  return Specialite.findByPk(id);
}

async function updateById(id, data, options = {}) {
  const specialite = await Specialite.findByPk(id);
  if (!specialite) throw new Error(`Spécialité avec l'ID ${id} non trouvée`);
  return specialite.update(data, options);
}

async function deleteByPk(id) {
  const specialite = await Specialite.findByPk(id);
  if (!specialite) throw new Error(`Spécialité avec l'ID ${id} non trouvée`);
  return specialite.destroy();
}

async function deleteByEleveId(eleveId, options = {}) {
  return Specialite.destroy({ where: { eleveId }, ...options });
}

module.exports = { create, bulkCreate, findByEleveId, findByPk, updateById, deleteByPk, deleteByEleveId };