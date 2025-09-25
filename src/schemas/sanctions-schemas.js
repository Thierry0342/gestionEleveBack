const { DataTypes } = require("sequelize"); 
const sequelize = require("../data-access/database-connection"); 
const SanctionSchema = sequelize.define("Sanction",
{
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
      eleveId:{ type: DataTypes.INTEGER, allowNull: true, },
       sanction:{ type:DataTypes.BOOLEAN, allowNull:true, },
       motif: {
          type: DataTypes.TEXT, 
          allowNull: false,
        }, });

        module.exports = SanctionSchema;