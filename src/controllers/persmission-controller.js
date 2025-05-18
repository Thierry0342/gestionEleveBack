const permissionService = require("../service/permission-service");


async function createPermission(req, res) {
  try {
    const data = req.body;
    const newPermission = await permissionService.createPermission(data);
    res.status(201).json(newPermission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de persmission eleve gendarme" });
  }
}


async function getAllPermission(req, res) {
  try {
    const permission = await permissionService.findAllPermission();
    res.json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des donnee" });
  }
}


async function deletePermission(req, res) {
  try {
    const id = req.params.id;
    await permissionService.deletePermission(id);
    res.status(200).json({ message: "Permission SUpprimer" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression " });
  }
}


async function getPermissionById(req, res) {
  try {
    const id = req.params.id;
    const permission = await permissionService.findPermissionById(id);
    if (permission) {
      res.json(permission);
    } else {
      res.status(404).json({ error: "aucune donne trouve" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
}
async function getFindPermissionByCour(req, res) {
  try {
    const cour = req.params.id;
    console.log("cour ve ee",cour);
    const permission = await permissionService.findPermissionByCour(cour);
    if (permission) {
      res.json(permission);
    } else {
      res.status(404).json({ error: "Permission  non trouvée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération " });
  }
}


async function updatePermission(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    await permissionService.updatePermission(id, data);
    res.status(200).json({ message: "permission mise à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour " });
  }
}

module.exports = {
  createPermission,
  getAllPermission,
  deletePermission,
  getPermissionById,
  updatePermission,
  getFindPermissionByCour
};
