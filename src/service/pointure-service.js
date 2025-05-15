const Pointure=require("../schemas/pointure-schema");
const Eleve = require("../schemas/eleve-schema");
const { Model } = require("sequelize");
async function create(pointure){
    return Pointure.create(pointure)
}
async function getPointureByCour() {
    try {
        // Filtrer les pointures par cour
        const pointures = await Pointure.findAll({
            include:[{
                model:Eleve,
                attributes:["nom","prenom","escadron","peloton","cour"]

            }
                
            ]
           
        }); 
        return pointures;
    } catch (error) {
        console.error("Erreur lors de la récupération des pointures par cours:", error);
        throw error;
    }
}

module.exports={create,getPointureByCour};
