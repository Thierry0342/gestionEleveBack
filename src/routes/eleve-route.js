var express = require('express');
var router = express.Router();



const { storage } = require("../configs/global-config");
var multer = require("multer");
const upload = multer({ storage });

var eleve_controller = require("../controllers/eleve-controler");

router.post("/",upload.single("image"),eleve_controller.create);
router.get("/",eleve_controller.getAll);
router.delete("/:id",eleve_controller.deleteByPk)

module.exports = router;