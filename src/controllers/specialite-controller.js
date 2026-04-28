const specialite_service = require("../service/specialite-service");
const eleve_service = require("../service/eleve-service");
const DB = require("../data-access/database-connection");

// GET /api/specialites/eleve/:eleveId
async function getByEleve(req, res) {
  try {
    const { eleveId } = req.params;

    const eleve = await eleve_service.findByPk(eleveId);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    const specialites = await specialite_service.findByEleveId(eleveId);

    return res.status(200).json({
      ancienChamp: eleve.SpecialisteAptitude || null, // données existantes conservées
      specialites,
    });

  } catch (error) {
    console.error("Erreur récupération spécialités :", error);
    res.status(500).json({ message: error.message });
  }
}

// POST /api/specialites/eleve/:eleveId  (une seule)
async function create(req, res) {
  const t = await DB.transaction();
  try {
    const { eleveId } = req.params;
    const { categorie, detail, niveauQualification } = req.body;

    if (!categorie) return res.status(400).json({ message: "La catégorie est obligatoire" });

    const eleve = await eleve_service.findByPk(eleveId);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    const specialite = await specialite_service.create({
      eleveId,
      categorie,
      detail: detail || null,
      niveauQualification: niveauQualification || null,
    }, { transaction: t });

    await t.commit();
    return res.status(201).json(specialite);

  } catch (error) {
    await t.rollback();
    console.error("Erreur création spécialité :", error);
    res.status(500).json({ message: error.message });
  }
}

// POST /api/specialites/eleve/:eleveId/bulk  (plusieurs en une fois)
async function bulkCreate(req, res) {
  const t = await DB.transaction();
  try {
    const { eleveId } = req.params;
    const { specialites } = req.body;

    if (!Array.isArray(specialites) || specialites.length === 0) {
      return res.status(400).json({ message: "Aucune spécialité fournie" });
    }

    const eleve = await eleve_service.findByPk(eleveId);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    const lignes = specialites
      .filter(sp => sp.categorie) // ignorer lignes vides
      .map(sp => ({
        eleveId,
        categorie: sp.categorie,
        detail: sp.detail || null,
        niveauQualification: sp.niveauQualification || null,
      }));

    const created = await specialite_service.bulkCreate(lignes, { transaction: t });

    await t.commit();
    return res.status(201).json(created);

  } catch (error) {
    await t.rollback();
    console.error("Erreur bulk création spécialités :", error);
    res.status(500).json({ message: error.message });
  }
}

// PUT /api/specialites/:id
async function update(req, res) {
  const t = await DB.transaction();
  try {
    const { id } = req.params;
    const { categorie, detail, niveauQualification } = req.body;

    const updated = await specialite_service.updateById(id, {
      categorie,
      detail: detail || null,
      niveauQualification: niveauQualification || null,
    }, { transaction: t });

    await t.commit();
    return res.status(200).json(updated);

  } catch (error) {
    await t.rollback();
    console.error("Erreur mise à jour spécialité :", error);
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/specialites/:id
async function deleteByPk(req, res) {
  const t = await DB.transaction();
  try {
    const { id } = req.params;

    await specialite_service.deleteByPk(id);

    await t.commit();
    return res.status(200).json({ message: "Spécialité supprimée avec succès" });

  } catch (error) {
    await t.rollback();
    console.error("Erreur suppression spécialité :", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getByEleve, create, bulkCreate, update, deleteByPk };