const Eleve = require("./eleve-schema");
const Pointure = require("./pointure-schema");
const Conjointe = require("./conjointe-schema")
const Mere = require ("./mere-schema");
const Pere = require ("./mere-schema");
const Enfant = require("./enfant-schema");

//relation eleve-pointure 
Eleve.hasOne(Pointure, { foreignKey: "eleveId" });
Pointure.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve-conjointe
Eleve.hasOne(Conjointe, { foreignKey: "eleveId" });
Conjointe.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation mere fils
Eleve.hasOne(Mere, { foreignKey: "eleveId" });
Mere.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation pere fils
Eleve.hasOne(Pere, { foreignKey: "eleveId" });
Pere.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve efant
Eleve.hasOne(Enfant, { foreignKey: "eleveId" });
Enfant.belongsTo(Eleve, { foreignKey: "eleveId" });



module.exports = { Eleve, Pointure,Conjointe ,Mere};
