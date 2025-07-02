const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const SportSchema = sequelize.define("Sport",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      Football:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      Basketball:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      Rugby:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      Musculation:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,

      },
      Volley_ball:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      Athletisme:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      Tennis:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      ArtsMartiaux:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,

      },
      Autre:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
        
    })
        
    
     
module.exports = SportSchema;

