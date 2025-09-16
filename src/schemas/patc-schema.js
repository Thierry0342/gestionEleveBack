const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const PatcSchema = sequelize.define("Patc",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      dateDebut:{
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dateFin:{
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      cour:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },   

});

 

module.exports = PatcSchema;

