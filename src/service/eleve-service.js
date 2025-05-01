const Eleve=require("../schemas/eleve-schema");
const Pointure=require("../schemas/pointure-schema")
const Conjointe = require("../schemas/conjointe-schema")
const Mere = require("../schemas/mere-schema");

async function create(eleve){
    return Eleve.create(eleve)
}
async function findAll() {
    return Eleve.findAll({
      include: [Pointure,Conjointe,Mere], // inclut automatiquement les pointures liées
    });
  }

  async function findByPk(id){
    return Eleve.findByPk(id,{
        include:[Pointure,Conjointe,Mere],
    })
  }

module.exports={create,findAll,findByPk};
