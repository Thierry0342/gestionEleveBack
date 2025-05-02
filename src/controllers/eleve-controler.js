const eleve_service = require("../service/eleve-service");
const pointure_service=require("../service/pointure-service");
const conjointe_service = require("../service/conjoite-service")
const mere_service = require("../service/mere-service");
const pere_service = require("../service/pere-service");
const enfant_service = require("../service/enfant-service"); 
const soeur_service = require ("../service/soeur-service");
const frere_service = require("../service/frere-service");
const accident_service = require("../service/accident-service");
const sport_service = require("../service/sport-service");

const DB = require("../data-access/database-connection");


async function create(req, res, next) {
    const t = await DB.transaction(); // Commence une transaction
  try {
    console.log(req.body);
    const data = req.body; // Récupère toutes les données envoyées

    const pointureData = req.body.pointure ;
    const conjointeData = req.body.famille.conjointe ;
    const mereData = req.body.famille.mere;
    const pereData = req.body.famille.pere;
    const accidentData = req.body.famille.accident;
    const enfantData = req.body.famille.enfant || [] ;
    const soeurData = req.body.famille.soeur || [] ;
    const frereData = req.body.famille.frere || [] ;
    const sportData = req.body.sports || [] ;
    

    // Appel du service pour enregistrer les données

    
    const newEleve = await eleve_service.create(data);
     // Création de la pointure lié
     if (pointureData){
        await pointure_service.create({
            ...pointureData,
            eleveId: newEleve.id,
          } ,{ transaction: t }        );
     }
     //creation de la conjointe liee
      if (conjointeData){
        await conjointe_service.create({
            nom : conjointeData.nom,
            adresse : conjointeData.adresse,
            phone : conjointeData.phone,
            eleveId : newEleve.id
        } ,{ transaction: t })
     }
     //creation table mere
     if (mereData){
        await mere_service.create({
            nom : mereData.nom,
            adresse : mereData.adresse,
            phone : mereData.phone,
            eleveId : newEleve.id
        },{ transaction: t })
     }
     //creation table pere
     if (pereData){
        await pere_service.create({
            nom:pereData.nom,
            adresse : pereData.adresse,
            phone : pereData.phone,
            eleveId : newEleve.id
        },{ transaction: t })
     }
     //accident 
     if (accidentData){
      await accident_service.create({
        nom : accidentData.nom,
        adresse : accidentData.adresse,
        phone : accidentData.phone,
        eleveId : newEleve.id
      },{transaction : t})

     }
     if (enfantData.length > 0){
        for (const enfant of enfantData){
            await enfant_service.create({
                nom : enfant.nom,
                enfant :enfantData.dateNaissance,
                sexe : enfant.sexe,
                eleveId : newEleve.id
                
            },{ transaction: t })

        }
      if (soeurData.length > 0){
        for (const soeur of soeurData){
          await soeur_service.create({
            nom : soeur.nom ,
            eleveId : newEleve.id,
          },{transaction : t})
        }
      }
      if (frereData.length > 0){
        for (const frere of frereData){
          await frere_service.create({
            nom : frere.nom ,
            eleveId : newEleve.id,
          },{transaction : t})
        }
      }
      //sport
      if (Array.isArray(sportData)) {
        const sportPayload = {
          eleveId: newEleve.id,
          Football: false,
          Basketball: false,
          Volley_ball: false,
          Athletisme: false,
          Tennis: false,
          Autre: false,
        };
        
      
        const mapping = {
          Football: "Football",
          Basketball: "Basketball",
          "Volley-ball": "Volley_ball",      
          Athlétisme: "Athletisme",      
          Tennis: "Tennis",
          Autre: "Autre",
        };
      
        sportData.forEach(sport => {
          const key = mapping[sport];
          if (key) {
            sportPayload[key] = true;
          }
        });
      
        await sport_service.create(sportPayload, { transaction: t });
      }
      
      


     }
    
     //commit jiaby
     await t.commit(); // Valide toutes les insertions
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