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
async function create(eleve , options ={}){
    return Eleve.create(eleve,options) //option contien transaction
}
async function findAll() {
    return Eleve.findAll({
      include: [Pointure,Conjointe,Mere,Pere,Enfant,Soeur,Frere,Sport,Accident], // inclut automatiquement les pointures liées
    });
  }

  async function findByPk(id){
    return Eleve.findByPk(id,{
        include:[Pointure,Conjointe,Mere,Pere,Enfant,Soeur,Frere,Sport,Accident],
    })
  }

module.exports={create,findAll,findByPk};
