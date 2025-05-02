const Sport=require("../schemas/sport-schema");

async function create(sport){
    return Sport.create(sport)
}

module.exports={create};
