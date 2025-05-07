const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const AbsenceShemaa = sequelize.define("Absence",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },  
        date:{
          type : DataTypes.STRING,
          allowNull:false
        },
        motif :{
          type :DataTypes.STRING,
          allowNull:false,
        }
        
});
module.exports = AbsenceShemaa;

