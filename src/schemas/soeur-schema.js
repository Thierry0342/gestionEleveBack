const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const SoeurSchema = sequelize.define("Soeur", {
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
    comment: "Ex: enseignante, infirmière, commerçante..."
  },
});

module.exports = SoeurSchema;
