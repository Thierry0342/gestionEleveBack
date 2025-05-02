const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const PointureSchema = sequelize.define("Pointure",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: true,

      },
      tailleChemise: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tourTete: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pointurePantalon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pointureChaussure: {
        type: DataTypes.STRING,
        allowNull: true,
      },


});

 

module.exports = PointureSchema;

