const Frere=require("../schemas/frere-schema");

async function create(frere){
    return Frere.create(frere)
}

module.exports={create};
