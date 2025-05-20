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
async function createSpa(req,res){
    const data=req.body;
    try {
       const resp= await spaSpecialeService.create(data);
        res.json(resp)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "erreur" });
        
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
