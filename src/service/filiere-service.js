const Filiere=require("../schemas/filiere-schema");

async function create(filiere){
    return Filiere.create(filiere)
}

module.exports={create};
