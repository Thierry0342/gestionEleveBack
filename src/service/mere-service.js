const Mere=require("../schemas/mere-schema");

async function create(mere){
    return Mere.create(mere)
}

module.exports={create};
