const { where } = require("sequelize");
const NoteFrancais  = require("../schemas/noteFrancais-schema");
const Eleve=require("../schemas/eleve-schema");

// Créer une note
async function createNote(note) {
  return await NoteFrancais.create(note);
}

// Récupérer toutes les notes
async function findAllNotes() {
    return await NoteFrancais.findAll({
      include: [{
        model: Eleve,
        attributes: ['nom', 'prenom','escadron','numeroIncorporation','peloton','cour']
      }]
    });
  }
  

// Supprimer une note par ID
async function deleteNote(id) {
  return await NoteFrancais.findByIdAndUpdate(id);
}

// Récupérer une note par ID
async function findNoteById(id) {
  return await NoteFrancais.findByPk(id);
}

// Mettre à jour une note par ID
async function updateNote(id, updatedNote) {
    return await NoteFrancais.update(updatedNote, {
      where: { id: id }
    });
  }
  async function findByEleveId(id) {
    return await NoteFrancais.findOne({
      where: {
        eleveId: id
      }
    });
  }
  
  
  

module.exports = {
  createNote,
  findAllNotes,
  deleteNote,
  findNoteById,
  updateNote,
  findByEleveId
};
