// controllers/pointure-controller.js
const pointureService = require("../service/pointure-service");

async function getPointureByCourController(req, res) {
    const { cour } = req.params;

    try {
        const pointures = await pointureService.getPointureByCour();
        res.json(pointures);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des pointures" });
    }
}

module.exports = {
    getPointureByCourController
};
