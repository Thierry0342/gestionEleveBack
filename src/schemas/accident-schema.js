const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const AccidentSchema = sequelize.define("Accident", {
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
    comment: "Grade si FDS"
  },
  posteFDS: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Poste/affectation si FDS"
  },
});

module.exports = AccidentSchema;
