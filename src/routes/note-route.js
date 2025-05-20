// src/routes/log-routes.js
const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note-controller"); // Import du contrôleur


router.post("/", noteController.create);


router.get("/", noteController.findAll);


router.delete("/:id", noteController.delete);

router.get("/:id", noteController.getById);

router.get("/eleve/:id", noteController.getNoteByEleveId);

router.put("/:id", noteController.update);

module.exports = router;
