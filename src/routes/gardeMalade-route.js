var express = require('express');
var router = express.Router();

var garde_controller = require("../controllers/gardeMalade-controller");

router.post("/", garde_controller.createGardeMalade);
router.get("/", garde_controller.getAllGardeMalade);
router.get("/:id", garde_controller.getGardeMalade);
router.delete("/:id", garde_controller.deleteGardeMalade);
router.put("/:id", garde_controller.updateGardeMalade);

module.exports = router;
