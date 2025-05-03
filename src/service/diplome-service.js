const Diplome=require("../schemas/diplome-schema");

async function create(diplome){
    return Diplome.create(diplome)
}

module.exports={create};
