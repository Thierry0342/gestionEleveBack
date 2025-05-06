const cour_service = require("../service/cour-service");

// Obtenir tous les cours
exports.getAllCours = async (req, res) => {
  try {
    const cours = await cour_service.findAllCours();
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
    console.log(err);
  }
};

// Créer un cours
exports.createCour = async (req, res) => {
  try {
    const { cour } = req.body;
    if (!cour || Number(cour) < 76 || Number(cour) > 999) {
      return res.status(400).json({ error: 'Le cours doit être un nombre entre 77 et 999.' });
    }

    const newCour = await cour_service.createCour({ cour });
    res.status(201).json(newCour);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création du cours.' });
  }
};

// Supprimer un cours
exports.deleteCour = async (req, res) => {
  try {
    await cour_service.deleteCour(req.params.id);
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la suppression du cours.' });
    console.log(err)
  }
};
