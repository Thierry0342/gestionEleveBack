const eleve_service = require("../service/eleve-service");
const pointure_service=require("../service/pointure-service");
const conjointe_service = require("../service/conjoite-service")
const mere_service = require("../service/mere-service");
const pere_service = require("../service/mere-service");
const enfant_service = require("../service/enfant-service"); 


async function create(req, res, next) {
  try {
    console.log(req.body);
    const data = req.body; // Récupère toutes les données envoyées

    const pointureData = req.body.pointure ;
    const conjointeData = req.body.conjointe ;
    const mereData = req.body.mere;
    const pereData = req.body.pere;
    const enfantData = req.body.enfant || [] ;
    

    // Appel du service pour enregistrer les données
    const newEleve = await eleve_service.create(data);
     // Création de la pointure lié
     if (pointureData){
        await pointure_service.create({
            ...pointureData,
            eleveId: newEleve.id,
          });
     }
     //creation de la conjointe liee
      if (conjointeData){
        await conjointe_service.create({
            nom : conjointeData.nom,
            adresse : conjointeData.adresse,
            phone : conjointeData.phone,
            eleveId : newEleve.id
        })
     }
     //creation table mere
     if (mereData){
        await mere_service.create({
            nom:mereData.nom,
            adresse : mereData.adresse,
            phone : mereData.phone,
            eleveId : newEleve.id
        })
     }
     //creation table pere
     if (pereData){
        await pere_service.create({
            nom:mereData.nom,
            adresse : mereData.adresse,
            phone : mereData.phone,
            eleveId : newEleve.id
        })
     }
     if (enfantData.length > 0){
        for (const enfant of enfantData){
            await pere_service.create({
                nom : enfant.nom,
                enfant :enfantData.dateNaissance,
                sexe : enfant.sexe,
                eleveId : enfant.id
            })

        }
        
     }
     const eleve = await eleve_service.findByPk(newEleve.id);
     

    res.status(201).json( eleve);
  } catch (error) {
    console.error("Erreur lors de la création d’un élève :", error);
    res.status(500).json({ message: error });
  }
}
// get all eleve G
async function getAll(req, res) {
    try {
      const eleves = await eleve_service.findAll();
      res.status(201).json( eleves);
    } catch (error) {
      console.error("Erreur lors de la récupération des élèves :", error);
      res.status(500).json({ message: error.message });
    }
  }

module.exports = { create,getAll};