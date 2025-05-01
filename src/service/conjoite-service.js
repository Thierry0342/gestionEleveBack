const Conjointe=require("../schemas/conjointe-schema");

async function create(conjointe){
    return Conjointe.create(conjointe)
}

module.exports={create};
