const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const FiliereSchema = sequelize.define("Filiere",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
        filiereLicence: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filiereDoctorat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filiereMasterOne: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filiereMasterTwo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    

});
module.exports = FiliereSchema;

