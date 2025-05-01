const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const PereSchema = sequelize.define("Pere",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: true,

      },
        nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adresse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    

});
module.exports = PereSchema;

