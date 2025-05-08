const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const CadreChema = sequelize.define("Cadre",{
       id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
       nom:{
        type: DataTypes.STRING,
        allowNull: false,

      },
      matricule:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
        prenom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      

});
 
module.exports = CadreChema;

