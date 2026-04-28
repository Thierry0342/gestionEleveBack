const express = require("express");
const router = express.Router();
const specialiteController = require("../controllers/specialite-controller");

router.post("/eleve/:eleveId", specialiteController.create);

router.post("/eleve/:eleveId/bulk", specialiteController.bulkCreate);

router.get("/eleve/:eleveId", specialiteController.getByEleve);

router.put("/:id", specialiteController.update);

router.delete("/:id", specialiteController.deleteByPk);

module.exports = router;