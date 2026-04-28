const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const Specialite = sequelize.define("Specialite", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  niveauQualification: {
    type: DataTypes.ENUM('Licencié', 'En cours de licence', 'Autodidacte'),
    allowNull: true,
  },
});

module.exports = Specialite;