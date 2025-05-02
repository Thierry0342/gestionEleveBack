const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const FrereSchema = sequelize.define("Frere",{
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
        }
    

});
module.exports = FrereSchema;

