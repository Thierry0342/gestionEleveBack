const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const noteSchema = sequelize.define("note",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },  
        finfetta:{
          type : DataTypes.STRING,
          allowNull:true
        },
        mistage:{
          type :DataTypes.STRING,
          allowNull:true,
        },
        finstage:{
            type :DataTypes.STRING,
            allowNull:true,
        }
        
});
module.exports = noteSchema;

