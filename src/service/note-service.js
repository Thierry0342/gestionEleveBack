const { where } = require("sequelize");
const Note = require("../schemas/note-schema");

// Créer une note
async function createNote(note) {
  return await Note.create(note);
}

// Récupérer toutes les notes
async function findAllNotes() {
  return await Note.findAll();
}

// Supprimer une note par ID
async function deleteNote(id) {
  return await Note.findByIdAndUpdate(id);
}

// Récupérer une note par ID
async function findNoteById(id) {
  return await Note.findByPk(id);
}

// Mettre à jour une note par ID
async function updateNote(id, updatedNote) {
    return await Note.update(updatedNote, {
      where: { id: id }
    });
  }
  async function findByEleveId(id) {
    return await Note.findOne({
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
