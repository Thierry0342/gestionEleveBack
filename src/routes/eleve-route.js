var express = require('express');
var router = express.Router();

var eleve_controller = require("../controllers/eleve-controler");
router.post("/",eleve_controller.create);
router.get("/",eleve_controller.getAll);

module.exports = router;