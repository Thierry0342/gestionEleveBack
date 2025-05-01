const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const ConjointeSchema = sequelize.define("Conjointe",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: true,

      },
        nom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      adresse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    

});

(async () => {
    await sequelize.sync({ alter: true });
  })();

 

module.exports = ConjointeSchema;

