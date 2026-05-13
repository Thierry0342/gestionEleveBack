const  Tuteur  = require("../schemas/tuteur-schema");

async function create(data, options = {}) {
  return await Tuteur.create(data, options);
}

async function findByEleveId(eleveId) {
  return await Tuteur.findOne({ where: { eleveId } });
}

async function upsert(eleveId, data, options = {}) {
  const existing = await Tuteur.findOne({ where: { eleveId }, ...options });
  if (existing) {
    // On passe 'options' ici pour inclure la transaction si elle existe
    return await existing.update({ ...data, eleveId }, options);
  } else {
    return await Tuteur.create({ ...data, eleveId }, options);
  }
}

module.exports = { create, findByEleveId, upsert };