const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const EnfantSchema = sequelize.define("Enfant",{
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
      },
     

});
module.exports = EnfantSchema;

