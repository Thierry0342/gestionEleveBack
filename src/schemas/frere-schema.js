const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const FrereSchema = sequelize.define("Frere", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // ── Nouveau champ ──────────────────────────
  profession: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Ex: enseignant, gendarme, commerçant..."
  },
});

module.exports = FrereSchema;
