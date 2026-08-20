const Cadre = require("../schemas/cadre-schema");
const Consultation = require("../schemas/consultation-schema");
const sequelize = require("../data-access/database-connection");
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

// Supprimer un cadre par ID (détache les consultations liées avant suppression)
async function deleteCadre(id) {
  const t = await sequelize.transaction();
  try {
    // On détache les consultations avant de supprimer le cadre
    await Consultation.update(
      { cadreId: null },
      { where: { cadreId: id }, transaction: t }
    );

    await Cadre.destroy({ where: { id }, transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
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
async function updateCadrePhoto(id, photoPath) {
  const cadre = await Cadre.findByPk(id);
  if (!cadre) return null;

  if (cadre.photo) {
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