const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const DiplomeSchema = sequelize.define("Diplome",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      CEPE:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        
      },
      BEPC:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
      BACC_S:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
      BACC_L:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
      BACC_TECHNIQUE:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,

      },
      Licence:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
      MasterOne:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
      MasterTwo:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
      Doctorat:{
        type : DataTypes.BOOLEAN,
        allowNull : true,
        defaultValue : false,
      },
    
    })
        
    
     
module.exports = DiplomeSchema;

