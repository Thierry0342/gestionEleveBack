const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const SoeurSchema = sequelize.define("Soeur",{
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
        allowNull: true,
        }
    

});
module.exports = SoeurSchema;

