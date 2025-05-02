const Accident=require("../schemas/accident-schema");

async function create(accident){
    return Accident.create(accident)
}

module.exports={create};
