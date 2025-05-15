// routes/pointure-routes.js
const express = require("express");
const router = express.Router();
const pointureController = require("../controllers/pointure-controller");

router.get("/", pointureController.getPointureByCourController);

module.exports = router;
