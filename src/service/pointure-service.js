const Pointure=require("../schemas/pointure-schema");

async function create(pointure){
    return Pointure.create(pointure)
}

module.exports={create};
