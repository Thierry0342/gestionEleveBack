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
      chemise: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tete: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pantalon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      chaussure: {
        type: DataTypes.STRING,
        allowNull: true,
      },


});

 

module.exports = PointureSchema;

