const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const Eleve = sequelize.define("Eleve", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CIN: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateDelivrance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lieuDelivrance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duplicata: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  lieuDuplicata: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numeroIncorporation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matricule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lieuNaissance: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  situationFamiliale: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SpecialisteAptitude:{
    type: DataTypes.STRING,
    allowNull: true,

  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING, // Chemin ou URL
    allowNull: true,
  },
  genreConcours: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephone2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephone3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  relationGenante :{
    type : DataTypes.STRING,
    allowNull : true,
  },
  religion : {
    type : DataTypes.STRING,
    allowNull : false,
  },
  niveau : {
    type : DataTypes.STRING,
    allowNull : true,
  }

}, {
  
  
});


module.exports = Eleve;
