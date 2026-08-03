const express = require("express");
const router = express.Router();
const cadreController = require("../controllers/cadre-controller");
const { upload } = require("../middlewares/upload-config");

router.post("/", cadreController.createCadre);
router.get("/", cadreController.getAllCadre);
router.get("/:id", cadreController.getCadreBy);
router.delete("/:id", cadreController.deleteCadre);
router.put("/:id", cadreController.updateCadre);

// Upload / remplacement de la photo d'un cadre (multipart/form-data, champ "photo")
router.post("/:id/photo", upload.single("photo"), cadreController.uploadPhoto);

module.exports = router;
