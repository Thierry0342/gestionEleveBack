const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const ObservationSchema = sequelize.define("Observation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  auteur: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ObservationSchema;