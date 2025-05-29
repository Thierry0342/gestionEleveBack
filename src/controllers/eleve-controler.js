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
const diplome_service = require ("../service/diplome-service");
const filiere_service = require("../service/filiere-service");


const DB = require("../data-access/database-connection");


async function create(req, res, next) {
    const t = await DB.transaction(); // Commence une transaction
  try {
    //console.log(req.body);
    //console.log("qsfsfqfqsfqsfqfqfqqsfqsfqsfqf",req.file);
     //pour l'image 
     const imageFile = req.file;
     // Chemin relatif 
     const imageUrl = imageFile
       ? `/data/uploads/pictures/images/${imageFile.filename}`
       : null;
     
       const data = {
        ...req.body, // contient nom, prénom, etc.
        image: imageUrl, //  on ajoute ici l'image à enregistrer
      };
      // Parser toutes les données JSON encodées en string
         const pointureData = req.body.pointure ? JSON.parse(req.body.pointure) : null;

          const familleData = req.body.famille ? JSON.parse(req.body.famille) : {};
          const conjointeData = familleData.conjointe || null;
          const mereData = familleData.mere || null;
           const pereData = familleData.pere || null;
           const accidentData = familleData.accidents || null;
          const enfantData = familleData.enfants || [];
          const soeurData = familleData.soeur || [];
          const frereData = familleData.frere || [];

          const sportData = req.body.sports ? JSON.parse(req.body.sports) : [];
          const diplomeData = req.body.diplomes ? JSON.parse(req.body.diplomes) : [];


    
    // Appel du service pour enregistrer les données
    console.log(data);
    const newEleve = await eleve_service.create(data);
   
   
    if (pointureData){
      await pointure_service.create({
          ...pointureData,
          eleveId: newEleve.id,
        } ,{ transaction: t }        );
   }
     // Création de la pointure lié
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
          ArtsMartiaux :false,
          Autre: false,
        };

      
        const mapping = {
          Football: "Football",
          Basketball: "Basketball",
          "Volley-ball": "Volley_ball",      
          Athlétisme: "Athletisme",      
          Tennis: "Tennis",
          "arts martiaux" :"ArtsMartiaux",
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
      //diplome 
      
      if (Array.isArray(diplomeData)) {
        const diplomePayload = {
          eleveId: newEleve.id,
          CEPE: false,
          BEPC: false,
          BACC_S: false,
          BACC_L: false,
          Licence: false,
          MasterOne: false,
          MasterTwo: false,
          Doctorat: false,
        };

      
        const mapping = {
          CEPE: "CEPE",
          BEPC: "BEPC",
          "BACC S": "BACC_S",      
          Licence: "Licence",      
          "Master One": "MasterOne",
          "Master Two": "MasterTwo",
          Doctorat : "Doctorat"
        };
      
        diplomeData.forEach(diplome => {
          const key = mapping[diplome];
          if (key) {
            diplomePayload[key] = true;
          }
        });
        if(true){
          await filiere_service.create({
            eleveId : newEleve.id,
            filiereLicence : req.body.filiereLicence,
            filiereDoctorat : req.body.filiereDoctorat,
            filiereMasterTwo : req.body.filiereMasterTwo,
            filiereMasterOne : req.body.filiereMasterOne
           
          },{transaction : t})

        }

      //envoie
        await diplome_service.create(diplomePayload, { transaction: t });
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
    const limit = parseInt(req.query.limit) || 500;
    const offset = parseInt(req.query.offset) || 0;

    const eleves = await eleve_service.findAll({ limit, offset });

    const hostUrl = `${req.protocol}://${req.get('host')}`;

    const elevesWithImage = eleves.map(eleve => {
      const plainEleve = eleve.toJSON();
      return {
        ...plainEleve,
        image: plainEleve.image ? `${hostUrl}${plainEleve.image}` : null
      };
    });

    res.status(200).json(elevesWithImage);
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves :", error);
    res.status(500).json({ message: error.message });
  }
}



  async function deleteByPk(req,res,next) {
    
      try {
        // Récupérer l'élève avec toutes ses relations
        await eleve_service.deleteByPk(req.params.id)
        res.status(200).json({ message: "Élève supprimé avec succès" });
        
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
        
        
      }
    
  }
  async function update(req, res) {
    try {
      const { id } = req.params;
      let updatedData = req.body;
  
      // ⬇️ Ajoute ici la fonction utilitaire pour parser les champs JSON
      function parseIfJson(field) {
        try {
          if (typeof field === "string") {
            return JSON.parse(field);
          }
          return field;
        } catch (e) {
          console.warn("Erreur de parsing JSON:", e);
          return null;
        }
      }
  
      // ⬇️ Parse les champs complexes s’ils sont en JSON
      updatedData.famille = parseIfJson(updatedData.famille);
      updatedData.sports = parseIfJson(updatedData.sports);
      updatedData.diplomes = parseIfJson(updatedData.diplomes);
      updatedData.Pointure = parseIfJson(updatedData.Pointure);
      
  
      // ⬇️ Ajout de l’image si présente
      if (req.file) {
        const imageUrl = `/data/uploads/pictures/images/${req.file.filename}`;
        updatedData.image = imageUrl;
      }
  
      // ⬇️ Mise à jour via le service
      const eleve = await eleve_service.updateById(id, updatedData, {
        transaction: req.transaction,
      });
  
      res.status(200).json(eleve);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
  //get eleve by incorporation 
   async function getEleveByIncorporation (req, res) {
    try {
      const inc = req.params.inc;
      const cour = req.query.cour;
     // console.log('Incorporation:', inc);
      // console.log('Cours:', cour);
      if (!inc || !cour) {
        return res.status(400).json({ message: "Incorporation et cours sont nécessaires" });
      }
   // Rechercher l'élève par incorporation ET par cours
      const eleve = await eleve_service.findByIncorporation({incorporation: inc, cour: cour });
  
      if (!eleve) {
        return res.status(404).json({ message: "Élève non trouvé pour ce cours" });
      }
  
      // 3. Retourner l'élève et le cours
      res.json({ eleve });
  
    } catch (error) {
      console.error("Erreur récupération élève :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  


module.exports = { create,getAll,deleteByPk,update,getEleveByIncorporation};