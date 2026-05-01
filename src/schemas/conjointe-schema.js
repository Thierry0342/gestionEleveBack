const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const ConjointeSchema = sequelize.define("Conjointe", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eleveId: {
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
  // ── Profession ──────────────────────────────────────
  profession: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Ex: ministre du tourisme, commerçant(e), gendarme..."
  },
  estFDS: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    comment: "Est-il/elle membre des Forces de Défense et Sécurité ?"
  },
  gradeFDS: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Grade si FDS (ex: Adjudant, Lieutenant...)"
  },
  posteFDS: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Poste/affectation si FDS"
  },
});

module.exports = ConjointeSchema;
