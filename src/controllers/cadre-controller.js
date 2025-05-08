const cadre_service = require("../service/cadre-service");

// Créer cadre
async function createCadre(req, res) {
  try {
    const data = req.body;
    const newCadre = await cadre_service.createCadre(data);
    res.status(201).json(newCadre);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de cadre" });
    console.log(error);
  }
}

// Lister toutes les absences
async function getAllCadre(req, res) {
  try {
    const cadre = await cadre_service.findAllCadre();
    res.json(cadre);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des cadre" });
    console.log(error);
  }
}

// Supprimer une absence par ID
async function  deleteCadre(req,res) {

    try {
      const id =req.params.id;
      await cadre_service.deleteCadre(id);
      console.log('Cadre supprimé avec succès');
     
    } catch (error) {
      console.log("Erreur lors de la suppression du cadre:", error);
      throw error;  //
    }
  }
  
// Obtenir les absences par élève
async function getCadreById(req, res) {
  try {
    const id = req.params.eleveId;
    const cadre = await cadre_service.getCadreById(id);
    res.json(cadre);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de donnee " });
  }
}
async function updateCadre(req, res) {
    try {
    
     
      const data = req.body;
      console.log(req.body);
      console.log(req.params.id);
  
      // Mise à jour du cadre dans la base de données
       await cadre_service.updateCadre(req.params.id,data);
      // Retourner une réponse avec succès
      res.status(200).json({ message: "Cadre mis à jour avec succès" });
  
    } catch (error) {
      // Gérer l'erreur si la mise à jour échoue
      console.error("Erreur lors de la mise à jour du cadre:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour du cadre" });
    }
  }

module.exports = {
    getCadreById,
    deleteCadre,
    getAllCadre,
    createCadre,
    updateCadre
};
