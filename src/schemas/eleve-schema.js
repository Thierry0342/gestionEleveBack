const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const Eleve = sequelize.define("Eleve", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cour:{
    type :DataTypes.INTEGER,
    allowNull:false,

  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numCandidature : {
    type : DataTypes.STRING,
    allowNull : true,
  },

  escadron : {
    type :DataTypes.INTEGER,
    allowNull : false,

  },
  peloton : {
    type :DataTypes.INTEGER,
    allowNull : false,
  },
  CIN: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateDelivrance: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  lieuDelivrance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  centreConcours :{
    type : DataTypes.STRING,
    allowNull : true,

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
    allowNull: true,
  },
  lieuNaissance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  situationFamiliale: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sexe:{
    type:DataTypes.STRING,
    allowNull:true

  },
  Specialiste:{
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
  niveaufiliere:{
    type: DataTypes.STRING,
    allowNull: true,

  },
  genreConcours: {
    type: DataTypes.STRING,
    allowNull: true,
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
    allowNull : true,
    
  },
  niveau : {
    type : DataTypes.STRING,
    allowNull : true,
  },
  SpecialisteAptitude :{
    type : DataTypes.STRING,
    allowNull : true,

  },
  groupeSaguin : {
    type : DataTypes.STRING,
    allowNull : true,
  },
  niveau:{
    type : DataTypes.STRING,
    allowNull : true,
  },
  fady:{
    type : DataTypes.STRING,
    allowNull : true,

  }


}, {
  
  
});


module.exports = Eleve;
