const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const SpasPecialeSchema = sequelize.define("spaSpeciale",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      motif:{
        type: DataTypes.STRING,
        allowNull: false,

      },
        nombre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            }
    

});

module.exports = SpasPecialeSchema;

