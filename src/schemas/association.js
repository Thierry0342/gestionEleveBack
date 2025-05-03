const Eleve = require("./eleve-schema");
const Pointure = require("./pointure-schema");
const Conjointe = require("./conjointe-schema")
const Mere = require ("./mere-schema");
const Pere = require ("./pere-schema");
const Enfant = require("./enfant-schema");
const Soeur = require("./soeur-schema");
const Frere = require("./frere-schema");
const Accident =require ("./accident-schema");
const Sport = require ("./sport-schema");
const Diplome = require ("./diplome-schema");
const Filiere = require ("./filiere-schema")

//relation pere fils
Eleve.hasOne(Pere, { foreignKey: "eleveId" });
Pere.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve-pointure 
Eleve.hasOne(Pointure, { foreignKey: "eleveId" });
Pointure.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve-conjointe
Eleve.hasOne(Conjointe, { foreignKey: "eleveId" });
Conjointe.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation mere fils
Eleve.hasOne(Mere, { foreignKey: "eleveId" });
Mere.belongsTo(Eleve, { foreignKey: "eleveId" });

//relation eleve efant
Eleve.hasMany(Enfant, { foreignKey: "eleveId" });
Enfant.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve soeur
Eleve.hasMany(Soeur, { foreignKey: "eleveId" });
Soeur.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve frere
Eleve.hasMany(Frere, { foreignKey: "eleveId" });
Frere.belongsTo(Eleve, { foreignKey: "eleveId" });
//relation eleve accident
Eleve.hasOne(Accident, { foreignKey: "eleveId" });
Accident.belongsTo(Eleve, { foreignKey: "eleveId" });

//relation eleve sport
Eleve.hasOne(Sport, { foreignKey: "eleveId" });
Sport.belongsTo(Eleve, { foreignKey: "eleveId" });
//eleve diplome 
Eleve.hasOne(Diplome, { foreignKey: "eleveId" });
Diplome.belongsTo(Eleve, { foreignKey: "eleveId" });

//eleve filiere
Eleve.hasOne(Filiere, { foreignKey: "eleveId" });
Filiere.belongsTo(Eleve, { foreignKey: "eleveId" });


module.exports = { Eleve, Pointure,Conjointe ,Mere,Pere,Soeur,Frere,Accident,Sport,Diplome,Filiere};