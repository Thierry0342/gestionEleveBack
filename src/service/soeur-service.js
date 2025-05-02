const Soeur=require("../schemas/soeur-schema");

async function create(soeur){
    return Soeur.create(soeur)
}

module.exports={create};
