const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const Tuteur = sequelize.define("Tuteur", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nom: { type: DataTypes.STRING, allowNull: true },
  adresse: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  lienParente: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Ex: Oncle, Tante, Grand-père, Tuteur légal..."
  },
  profession: { type: DataTypes.STRING, allowNull: true },
  estFDS: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  gradeFDS: { type: DataTypes.STRING, allowNull: true },
  posteFDS: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Tuteur;