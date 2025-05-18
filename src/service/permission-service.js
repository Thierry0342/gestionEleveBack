
const Eleve = require("../schemas/eleve-schema");
const Permission = require("../schemas/permission-schema");

async function createPermission(data) {
  return Permission.create(data);
}


async function findAllPermission() {
  return Permission.findAll({
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "numeroIncorporation","escadron","peloton","cour"]
      }

    ]
  });
}


async function deletePermission(id) {
  return Permission.destroy({ where: { id } });
}

// Obtenir une consultation par ID (avec jointure)
async function findPermissionById(id) {
  return Permission.findOne({
    where: { id },
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "matricule","cour"]
      }
    ]
  });
}
//Consultation by cour
async function findPermissionByCour(cour) {
  return Permission.findAll({
    where: { cour },
    include: [
      {
        model: Eleve,
        attributes: ["id", "nom", "prenom", "matricule","escadron","peloton","numeroIncorporation"]
      }
    ]
  });
}

// Mise à jour d'une consultation
async function updatePermission(id, data) {
  return Permission.update(data, { where: { id } });
}


module.exports = {
  createPermission,
  findAllPermission,
  deletePermission,
  findPermissionById,
  updatePermission,
  findPermissionByCour
};
