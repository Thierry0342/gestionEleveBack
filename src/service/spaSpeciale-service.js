
const spaSpeciale = require("../schemas/spaSpeciale-schema");


async function create(data) {
  return spaSpeciale.create(data);
}
async function createMany(dataArray) {
  return spaSpeciale.insertMany(dataArray);
}


async function findAll() {
    return spaSpeciale.findAll()
  }


async function deletee(id) {
  return spaSpeciale.destroy({ where: { id } });
}


async function getById(id) {
  return spaSpeciale.findOne({ where: { matricule:id } });
}

async function updateSpa(id, data) {
    
    return spaSpeciale.update(data, { where: { id } });

  }

module.exports = {
    create,
    findAll,
    deletee,
    getById,
    updateSpa,
    createMany
  
};
