const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const Detailsconsultation = sequelize.define("DetailsConsultation",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      hospitalisation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nonhospitaliisation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    

});
module.exports = Detailsconsultation;

