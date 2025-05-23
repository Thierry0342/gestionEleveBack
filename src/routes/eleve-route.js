var express = require('express');
var router = express.Router();


const { upload } = require("../configs/global-config"); // le bon fichier


var eleve_controller = require("../controllers/eleve-controler");

router.post("/",upload.single("image"),eleve_controller.create);
router.get("/",eleve_controller.getAll);
router.delete("/:id",eleve_controller.deleteByPk);
router.put("/:id", upload.single('image'), eleve_controller.update);
router.get("/incorporation/:inc", eleve_controller.getEleveByIncorporation);

module.exports = router;