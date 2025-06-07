const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const GardeMaladeSchema = sequelize.define("GardeMalade",{
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
      
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone:{
        type:DataTypes.STRING,
        allowNull:true,
      }
      

});
 
module.exports = GardeMaladeSchema;

