
const Cadre = require("../schemas/cadre-schema");

// Créer une absence
async function createCadre(data) {
  return Cadre.create(data);
}

// Obtenir toutes les absences
async function findAllCadre() {
    return Cadre.findAll()
  }

// Supprimer une absence par ID
async function deleteCadre(id) {
  return Cadre.destroy({ where: { id } });
}

// Obtenir les absences d'un élève donné 
async function getCadreById(id) {
  return Cadre.findOne({ where: { matricule:id } });
}

async function updateCadre(id, data) {
    
    return Cadre.update(data, { where: { id } });

  }

module.exports = {
    createCadre,
    findAllCadre,
    deleteCadre,
    getCadreById,
    updateCadre
  
};
