const Pere=require("../schemas/pere-schema");

async function create(pere){
    return Pere.create(pere)
}

module.exports={create};
