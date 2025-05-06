var express = require('express');
var router = express.Router();

var cour_controller = require("../controllers/cour-controller");

router.post("/",cour_controller.createCour);
router.get("/",cour_controller.getAllCours);
router.delete("/:id",cour_controller.deleteCour);


module.exports = router;