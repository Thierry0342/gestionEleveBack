const express = require("express");
const router = express.Router();
const cadreController = require("../controllers/cadre-controller");

router.post("/", cadreController.createCadre);
router.get("/", cadreController.getAllCadre);
router.get("/:id", cadreController.getCadreBy);
router.delete("/:id", cadreController.deleteCadre);
router.put("/:id", cadreController.updateCadre);

module.exports = router;
