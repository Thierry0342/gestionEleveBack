// controllers/pointure-controller.js
const spaSpecialeService = require("../service/spaSpeciale-service");

async function getSpaSpeciale(req, res) {
  
    try {
        const spa = await spaSpecialeService.findAll();
        res.json(spa);
    } catch (error) {
        res.status(500).json({ message: "erreur" });
    }
}
async function createSpa(req, res) {
    const data = req.body;
  
    try {
      let result;
  
      if (Array.isArray(data)) {
        // Si c’est un tableau, on insère plusieurs entrées
        result = await spaSpecialeService.createMany(data);
      } else {
        // Sinon, on insère une seule entrée
        result = await spaSpecialeService.create(data);
      }
  
      res.json(result);
  
    } catch (error) {
      console.error("Erreur dans createSpa:", error);
      res.status(500).json({ message: "Erreur lors de l'enregistrement des SPA." });
    }
  }
  
async function deleteSpa(req,res,params){
    const id=req.params.id;
    try {
        const del=await spaSpecialeService.deletee(id);
        res.json(del)
    } catch (error) {
        res.status(500).json({ message: "erreur" });
        
    }
}
async function update(req,res,params){
    const id=req.params.id;
    const data=req.body;
    try {
        const up=await spaSpecialeService.updateSpa(id,data);
        res.json(up)

        
    } catch (error) {
        res.status(500).json({ message: "erreur" });
        console.log(error);
    }
}


module.exports = {
    getSpaSpeciale,
    createSpa,
    deleteSpa,
    update
};
