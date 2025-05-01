const Eleve = require("./eleve-schema");
const Pointure = require("./pointure-schema");
const Conjointe = require("./conjointe-schema")

//relation eleve-pointure 
Eleve.hasOne(Pointure, { foreignKey: "eleveId" });
Pointure.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve-conjointe
Eleve.hasOne(Conjointe, { foreignKey: "eleveId" });
Conjointe.belongsTo(Eleve, { foreignKey: "eleveId" });



module.exports = { Eleve, Pointure,Conjointe };
