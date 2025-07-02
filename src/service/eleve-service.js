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
const Note = require ('../schemas/note-schema');
const { where } = require("sequelize");

async function create(eleve , options ={}){
    return Eleve.create(eleve,options) //option contien transaction
}
async function findAll({ limit = 500, offset = 0 }) {
    return Eleve.findAll({
      limit,
      offset,
      include: [Pointure,Conjointe,Mere,Pere,Enfant,Soeur,Frere,Sport,Accident,Diplome,Filiere, { model: Note, as: 'Note' } ],
      order: [['id', 'ASC']], // inclut automatiquement les pointures liées
    });
  }

  async function findByPk(id){
    return Eleve.findByPk(id,{
        include:[Pointure,Conjointe,Mere,Pere,Enfant,Soeur,Frere,Sport,Accident,Diplome,Filiere, { model: Note, as: 'Note' } ],
    })
  }
  async function deleteByPk(id) {
    
    // Récupérer l'élève avec toutes ses relations
    const eleve = await Eleve.findByPk(id, {
      include: [Pointure, Conjointe, Mere, Pere, Enfant, Soeur, Frere, Sport, Accident, Diplome, Filiere, { model: Note, as: 'Note' }],
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
      eleve.Note?.destroy(),
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
    updatedData.Diplome = parseIfJson(updatedData.Diplome);
    updatedData.Filiere = parseIfJson(updatedData.Filiere);
    updatedData.Pointure = parseIfJson(updatedData.Pointure);
  
    const eleve = await Eleve.findByPk(id, {
      include: [Pointure, Conjointe, Mere, Pere, Enfant, Soeur, Frere, Sport, Accident, Diplome, Filiere],
      transaction: options.transaction
    });
  
    if (!eleve) {
      throw new Error(`Élève avec l'ID ${id} non trouvé`);
    }
  
    await eleve.update(updatedData, { transaction: options.transaction });
  
    // POINTURE
    if (updatedData.Pointure) {
      const exist = await Pointure.findOne({ where: { eleveId: id }, transaction: options.transaction });
      if (exist) {
        await Pointure.update(updatedData.Pointure, { where: { eleveId: id }, transaction: options.transaction });
      } else {
        await Pointure.create({ ...updatedData.Pointure, eleveId: id }, { transaction: options.transaction });
      }
    }
  
    // FAMILLE
    if (updatedData.famille) {
      const familleData = updatedData.famille;
  
      const updateOrCreate = async (Model, data) => {
        const exist = await Model.findOne({ where: { eleveId: id }, transaction: options.transaction });
        if (exist) {
          await Model.update(data, { where: { eleveId: id }, transaction: options.transaction });
        } else {
          await Model.create({ ...data, eleveId: id }, { transaction: options.transaction });
        }
      };
  
      if (familleData.conjointe) await updateOrCreate(Conjointe, familleData.conjointe);
      if (familleData.mere) await updateOrCreate(Mere, familleData.mere);
      if (familleData.pere) await updateOrCreate(Pere, familleData.pere);
      if (familleData.accident) await updateOrCreate(Accident, familleData.accident);
  
      // ENFANTS
      if (familleData.enfants) {
        const enfantsActuels = await Enfant.findAll({ where: { eleveId: id }, transaction: options.transaction });
        const idsReçus = familleData.enfants.filter(e => e.id).map(e => e.id);
  
        for (const enfant of enfantsActuels) {
          if (!idsReçus.includes(enfant.id)) {
            await Enfant.destroy({ where: { id: enfant.id }, transaction: options.transaction });
          }
        }
  
        for (const enfant of familleData.enfants) {
          if (enfant.id) {
            await Enfant.update(enfant, { where: { id: enfant.id }, transaction: options.transaction });
          } else {
            await Enfant.create({ ...enfant, eleveId: id }, { transaction: options.transaction });
          }
        }
      }
  
      // SOEUR
      if (familleData.soeur) {
        const soeursActuelles = await Soeur.findAll({ where: { eleveId: id }, transaction: options.transaction });
        const idsReçus = familleData.soeur.filter(s => s.id).map(s => s.id);
  
        for (const soeur of soeursActuelles) {
          if (!idsReçus.includes(soeur.id)) {
            await Soeur.destroy({ where: { id: soeur.id }, transaction: options.transaction });
          }
        }
  
        for (const soeur of familleData.soeur) {
          if (soeur.id) {
            await Soeur.update(soeur, { where: { id: soeur.id }, transaction: options.transaction });
          } else {
            await Soeur.create({ ...soeur, eleveId: id }, { transaction: options.transaction });
          }
        }
      }
  
      // FRERE
      if (familleData.frere) {
        const freresActuels = await Frere.findAll({ where: { eleveId: id }, transaction: options.transaction });
        const idsReçus = familleData.frere.filter(f => f.id).map(f => f.id);
  
        for (const frere of freresActuels) {
          if (!idsReçus.includes(frere.id)) {
            await Frere.destroy({ where: { id: frere.id }, transaction: options.transaction });
          }
        }
  
        for (const frere of familleData.frere) {
          if (frere.id) {
            await Frere.update(frere, { where: { id: frere.id }, transaction: options.transaction });
          } else {
            await Frere.create({ ...frere, eleveId: id }, { transaction: options.transaction });
          }
        }
      }
    }
  
    // SPORTS
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
  
      const exist = await Sport.findOne({ where: { eleveId: id }, transaction: options.transaction });
      if (exist) {
        await Sport.update(sportPayload, { where: { eleveId: id }, transaction: options.transaction });
      } else {
        await Sport.create(sportPayload, { transaction: options.transaction });
      }
    }
  
    // DIPLOME
    if (updatedData.Diplome && typeof updatedData.Diplome === 'object') {
      const diplomePayload = {
        eleveId: id,
        CEPE: false,
        BEPC: false,
        BACC_S: false,
        BACC_L: false,
        BACC_TECHNIQUE:false,
        Licence: false,
        MasterOne: false,
        MasterTwo: false,
        Doctorat: false,
      };
  
      for (const [key, value] of Object.entries(updatedData.Diplome)) {
        if (diplomePayload.hasOwnProperty(key) && value === true) {
          diplomePayload[key] = true;
        }
      }
  
      const exist = await Diplome.findOne({ where: { eleveId: id }, transaction: options.transaction });
      if (exist) {
        await Diplome.update(diplomePayload, { where: { eleveId: id }, transaction: options.transaction });
      } else {
        await Diplome.create(diplomePayload, { transaction: options.transaction });
      }
    }
  
    // FILIERE
    if (updatedData.Filiere) {
      const exist = await Filiere.findOne({ where: { eleveId: id }, transaction: options.transaction });
      if (exist) {
        await Filiere.update(updatedData.Filiere, { where: { eleveId: id }, transaction: options.transaction });
      } else {
        await Filiere.create({ ...updatedData.Filiere, eleveId: id }, { transaction: options.transaction });
      }
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
