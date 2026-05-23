const Sport = require("../schemas/sport-schema");

async function create(sport) {
  return Sport.create(sport);
}

async function upsert(eleveId, data) {
  const existing = await Sport.findOne({ where: { eleveId } });
  if (existing) {
    return existing.update(data);
  } else {
    return Sport.create({ ...data, eleveId }); // ✅ Sport au lieu de SportSchema
  }
}

module.exports = { create, upsert }; // ✅ upsert ajouté à l'export