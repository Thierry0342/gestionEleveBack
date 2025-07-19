const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const noteFrancaisChema = sequelize.define("noteFrancais",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique:true,

      },  
    niveau:{
        type: DataTypes.STRING,
        allowNull: true,
        
    },
    note:{
        type: DataTypes.FLOAT,
        allowNull: true,
        
    }

});
module.exports = noteFrancaisChema;

