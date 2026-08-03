const Cadre = require("../schemas/cadre-schema");
const fs = require("fs");
const path = require("path");

// Créer un cadre
async function createCadre(data) {
  return Cadre.create(data);
}

// Obtenir tous les cadres
async function findAllCadre() {
  return Cadre.findAll();
}

// Supprimer un cadre par ID
async function deleteCadre(id) {
  return Cadre.destroy({ where: { id } });
}

// Obtenir un cadre par matricule (utilisé par getCadreBy)
async function getCadreById(id) {
  return Cadre.findOne({ where: { matricule: id } });
}

// Mettre à jour un cadre
async function updateCadre(id, data) {
  return Cadre.update(data, { where: { id } });
}

// ===== Photo =====
// Met à jour le champ photo, et supprime l'ancien fichier physique s'il existait
// (évite d'accumuler des fichiers orphelins sur le disque à chaque changement de photo).
async function updateCadrePhoto(id, photoPath) {
  const cadre = await Cadre.findByPk(id);
  if (!cadre) return null;

  if (cadre.photo) {
    // cadre.photo est du type "/data/uploads/pictures/images/xxx.jpg" (URL publique).
    // Le fichier physique est dans "<racine-projet>/public" + ce chemin (voir upload-config.js).
    const oldFilePath = path.join(__dirname, "..", "public", cadre.photo.replace(/^\//, ""));
    fs.unlink(oldFilePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Impossible de supprimer l'ancienne photo :", err);
      }
    });
  }

  cadre.photo = photoPath;
  await cadre.save();
  return cadre;
}

module.exports = {
  createCadre,
  findAllCadre,
  deleteCadre,
  getCadreById,
  updateCadre,
  updateCadrePhoto,
};
