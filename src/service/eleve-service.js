const Eleve=require("../schemas/eleve-schema");
const Pointure=require("../schemas/pointure-schema")
const Conjointe = require("../schemas/conjointe-schema")

async function create(eleve){
    return Eleve.create(eleve)
}
async function findAll() {
    return Eleve.findAll({
      include: [Pointure,Conjointe], // inclut automatiquement les pointures liées
    });
  }

  async function findByPk(id){
    return Eleve.findByPk(id,{
        include:[Pointure,Conjointe],
    })
  }

module.exports={create,findAll,findByPk};
