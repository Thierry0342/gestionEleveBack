const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const PermissionSchema = sequelize.define("Permission",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      telephone1:{
        type: DataTypes.STRING,
        allowNull: false,

      },
      telephone2:{
        type: DataTypes.STRING,
        allowNull: true,

      },
      telephone3:{
        type: DataTypes.STRING,
        allowNull: true,

      },
      phoneFamille:{
        type: DataTypes.STRING,
        allowNull: false,

      },
      lieu:{
        type: DataTypes.STRING,
        allowNull: false,

      },
      cour:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },

      

    
    

});

 

module.exports = PermissionSchema;

