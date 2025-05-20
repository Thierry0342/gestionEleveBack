const noteService = require("../service/note-service");

// Créer une nouvelle note
async function create(req, res) {
  try {
    const data = req.body;
    console.log(data);
    const newNote = await noteService.createNote(data);
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Erreur lors de la création de la note :", error);
    res.status(500).json({ error: "Erreur lors de la création de la note" });
  }
}

// Récupérer toutes les notes
async function findAll(req, res) {
  try {
    const notes = await noteService.findAllNotes();
    res.json(notes);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des notes" });
  }
}

// Supprimer une note par ID
async function deleteNote(req, res) {
  try {
    const id = req.params.id;
    await noteService.deleteNote(id);
    res.status(200).json({ message: "Note supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la note" });
  }
}

// Récupérer une note par ID
async function getById(req, res) {
  try {
    const id = req.params.id;
    const note = await noteService.findNoteById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Note non trouvée" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la note :", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la note" });
  }
}

// Mettre à jour une note
async function update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    await noteService.updateNote(id, data);
    res.status(200).json({ message: "Note mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la note" });
  }
}
async function getNoteByEleveId(req, res) {
    try {
      const eleveId = req.params.id;
      const note = await noteService.findByEleveId(eleveId);
      if (note) {
        res.json(note);
      } else {
        res.status(204).json(null); // Aucun contenu
      }
    } catch (error) {
      console.error("Erreur récupération note:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
  

module.exports = {
  create,
  findAll,
  delete: deleteNote,
  getById,
  update,
  getNoteByEleveId
};
