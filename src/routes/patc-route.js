const express = require("express");
const router = express.Router();
const patcController = require("../controllers/patc-controller");

router.post("/", patcController.createPatc);
router.get("/", patcController.getAllPatc);
router.get("/:id", patcController.getPatcById);
router.put("/:id", patcController.updatePatc);
router.delete("/:id", patcController.deletePatc);
router.get("/eleve/:eleveId", patcController.getPatcByEleveId); // <-- nouveau
router.post("/eleves", patcController.getPatcByEleves);

module.exports = router;
