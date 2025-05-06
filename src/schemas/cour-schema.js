const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const CourSchema = sequelize.define("Cour",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cour:{
        type: DataTypes.INTEGER,
        allowNull: false,

      }

});
module.exports = CourSchema;

