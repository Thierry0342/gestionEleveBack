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
  
  

module.exports={create,findAll,findByPk,deleteByPk};
