const Eleve=require("../schemas/eleve-schema");
const Pointure=require("../schemas/pointure-schema")
const Conjointe = require("../schemas/conjointe-schema")
const Mere = require("../schemas/mere-schema");
const Pere = require("../schemas/pere-schema");
const Enfant = require("../schemas/enfant-schema");
const Soeur = require ('../schemas/soeur-schema');
const Frere = require ('../schemas/frere-schema');
const Sport = require ('../schemas/sport-schema');
const Accident = require ('../schemas/accident-schema');
const Diplome = require ('../schemas/diplome-schema');
const Filiere = require ('../schemas/filiere-schema');
const { where } = require("sequelize");

async function create(eleve , options ={}){
    return Eleve.create(eleve,options) //option contien transaction
}
async function findAll() {
    return Eleve.findAll({
      include: [Pointure,Conjointe,Mere,Pere,Enfant,Soeur,Frere,Sport,Accident,Diplome,Filiere], // inclut automatiquement les pointures liées
    });
  }

  async function findByPk(id){
    return Eleve.findByPk(id,{
        include:[Pointure,Conjointe,Mere,Pere,Enfant,Soeur,Frere,Sport,Accident,Diplome,Filiere],
    })
  }
  async function deleteByPk(id) {
    
    // Récupérer l'élève avec toutes ses relations
    const eleve = await Eleve.findByPk(id, {
      include: [Pointure, Conjointe, Mere, Pere, Enfant, Soeur, Frere, Sport, Accident, Diplome, Filiere],
    });
  
    if (!eleve) {
      throw new Error(`Élève avec l'ID ${id} non trouvé`);
    }
    // Supprimer d'abord toutes les relations (si elles existent)
    await Promise.all([
      eleve.Pointure?.destroy(),
      eleve.Conjointe?.destroy(),
      eleve.Mere?.destroy(),
      eleve.Pere?.destroy(),
      eleve.Sport?.destroy(),
      eleve.Accident?.destroy(),
      eleve.Diplome?.destroy(),
      eleve.Filiere?.destroy(),
      ...((eleve.Enfants || []).map(e => e.destroy())),
      ...((eleve.Soeurs || []).map(s => s.destroy())),
      ...((eleve.Freres || []).map(f => f.destroy())),
    ]);
  
    // Ensuite, supprimer l'élève
    await eleve.destroy();
  }



  //function update
  async function updateById(id, updatedData, options = {}) {
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
    
    // Parse les champs complexes
    updatedData.famille = parseIfJson(updatedData.famille);
    updatedData.sports = parseIfJson(updatedData.sports);
    updatedData.diplomes = parseIfJson(updatedData.diplomes);
    updatedData.filiere = parseIfJson(updatedData.filiere);
    updatedData.pointure = parseIfJson(updatedData.pointure);
    
    // Récupérer l'élève avec toutes ses relations
    const eleve = await Eleve.findByPk(id, {
      include: [Pointure, Conjointe, Mere, Pere, Enfant, Soeur, Frere, Sport, Accident, Diplome, Filiere],
      transaction: options.transaction
    });

    if (!eleve) {
      throw new Error(`Élève avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour les données de l'élève
    await eleve.update(updatedData, { transaction: options.transaction });

    // Mettre à jour ses relations (si présentes dans les données reçues)
    if (updatedData.pointure) {
      await eleve.Pointure.update(updatedData.pointure, { transaction: options.transaction });
    }

    if (updatedData.famille) {
      const familleData = updatedData.famille;

      if (familleData.conjointe) {
        await eleve.Conjointe.update(familleData.conjointe, { transaction: options.transaction });
      }

      if (familleData.mere) {
        await eleve.Mere.update(familleData.mere, { transaction: options.transaction });
      }

      if (familleData.pere) {
        await eleve.Pere.update(familleData.pere, { transaction: options.transaction });
      }

      if (familleData.accident) {
        await eleve.Accident.update(familleData.accident, { transaction: options.transaction });
      }

      if (familleData.enfants && familleData.enfants.length > 0) {
        for (const enfant of familleData.enfants) {
          await Enfant.update(enfant, { where: { eleveId: id }, transaction: options.transaction });
        }
      }

      if (familleData.soeur && familleData.soeur.length > 0) {
        for (const soeur of familleData.soeur) {
          await Soeur.update(soeur, { where: { eleveId: id }, transaction: options.transaction });
        }
      }

      if (familleData.frere && familleData.frere.length > 0) {
        for (const frere of familleData.frere) {
          await Frere.update(frere, { where: { eleveId: id }, transaction: options.transaction });
        }
      }
    }

    // Mise à jour des sports
    if (updatedData.sports) {
      const sportPayload = {
        eleveId: id,
        Football: false,
        Basketball: false,
        Volley_ball: false,
        Athletisme: false,
        Tennis: false,
        ArtsMartiaux: false,
        Autre: false,
      };

      updatedData.sports.forEach(sport => {
        if (sport) sportPayload[sport] = true;
      });

      await Sport.update(sportPayload, { where: { eleveId: id }, transaction: options.transaction });
    }

    // Mise à jour des diplômes
    if (updatedData.diplomes) {
      const diplomePayload = {
        eleveId: id,
        CEPE: false,
        BEPC: false,
        BACC_S: false,
        BACC_L: false,
        Licence: false,
        MasterOne: false,
        MasterTwo: false,
        Doctorat: false,
      };

      updatedData.diplomes.forEach(diplome => {
        if (diplome) diplomePayload[diplome] = true;
      });

      await Diplome.update(diplomePayload, { where: { eleveId: id }, transaction: options.transaction });
    }

    // Mise à jour de la filière
    if (updatedData.filiere) {
      await Filiere.update(updatedData.filiere, { where: { eleveId: id }, transaction: options.transaction });
    }

    return eleve;
}

// Fonction pour trouver un élève
async function findByIncorporation({ incorporation, cour }) {
 
  try {
    
    const eleve = await Eleve.findOne({
      where: {
        numeroIncorporation: incorporation,  
        cour: cour  
      }
    });

    // Si l'élève est trouvé, on le retourne
    return eleve;
  } catch (error) {
    // Si une erreur survient lors de la recherche
    console.error("Erreur lors de la recherche de l'élève :", error);
    throw new Error("Erreur lors de la récupération de l'élève");
  }
}

  
  

module.exports={create,findAll,findByPk,deleteByPk,updateById,findByIncorporation };
