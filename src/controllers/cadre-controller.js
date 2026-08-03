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

// Lister tous les cadres
async function getAllCadre(req, res) {
  try {
    const cadre = await cadre_service.findAllCadre();
    res.json(cadre);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des cadre" });
    console.log(error);
  }
}

// Supprimer un cadre par ID
async function deleteCadre(req, res) {
  try {
    const id = req.params.id;
    await cadre_service.deleteCadre(id);
    console.log('Cadre supprimé avec succès');
    res.status(200).json({ message: "Cadre supprimé avec succès" });
  } catch (error) {
    console.log("Erreur lors de la suppression du cadre:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du cadre" });
  }
}

// Obtenir un cadre par matricule
async function getCadreBy(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    const cadre = await cadre_service.getCadreById(id);
    res.json(cadre);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur lors de la récupération de donnee " });
  }
}

async function updateCadre(req, res) {
  try {
    const data = req.body;
    console.log(req.body);
    console.log(req.params.id);

    await cadre_service.updateCadre(req.params.id, data);
    res.status(200).json({ message: "Cadre mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cadre:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du cadre" });
  }
}

// Upload / remplacement de la photo d'un cadre
// req.file est fourni par le middleware `upload` (voir upload-config.js, dossier public/data/uploads/pictures/images)
async function uploadPhoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }
    const id = req.params.id;
    // Chemin relatif stocké en base. Suppose que "public" est servi en statique
    // à la racine du serveur (app.use(express.static("public"))) — donc le fichier
    // physiquement dans public/data/uploads/pictures/images/xxx.jpg
    // est accessible via l'URL /data/uploads/pictures/images/xxx.jpg
    const photoPath = `/data/uploads/pictures/images/${req.file.filename}`;

    const updated = await cadre_service.updateCadrePhoto(id, photoPath);
    if (!updated) {
      return res.status(404).json({ error: "Cadre introuvable" });
    }

    res.status(200).json({ message: "Photo mise à jour avec succès", photo: photoPath });
  } catch (error) {
    console.error("Erreur lors de l'upload de la photo:", error);
    res.status(500).json({ error: "Erreur lors de l'upload de la photo" });
  }
}

module.exports = {
  getCadreBy,
  deleteCadre,
  getAllCadre,
  createCadre,
  updateCadre,
  uploadPhoto,
};
