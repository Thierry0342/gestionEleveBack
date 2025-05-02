const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const AccidentSchema = sequelize.define("Accident",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
        nom: {
        type: DataTypes.STRING,
        allowNull: true,
        },
        adresse :{
            type : DataTypes.STRING,
            allowNull : true

        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            }

    

});
module.exports = AccidentSchema;

