const Enfant=require("../schemas/enfant-schema");

async function create(enfant){
    return Enfant.create(enfant)
}

module.exports={create};
