const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const ConsultationSchema = sequelize.define("Consultation",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eleveId:{
        type: DataTypes.INTEGER,
        allowNull: false,

      },
       cadreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        dateDepart :{
            type : DataTypes.DATEONLY,
            allowNull : false

        },
        dateArrive :{
            type : DataTypes.DATEONLY,
            allowNull : true

        },
        refere:{
            type : DataTypes.STRING,
            allowNull:false,
        },
        service:{
            type :DataTypes.STRING,
            allowNull: true

        },
        refMessage:{
            type : DataTypes.STRING,
            allowNull:true,

        },
        phone:{
            type :DataTypes.STRING,
            allowNull:false,

        }  ,
        cour:{
            type : DataTypes.INTEGER,
            allowNull:false,

        },
        status :{
            type :DataTypes.STRING,
            allowNull:false,
            defaultValue:"en cours de traitement...",

        },
        hospitalise :{
            type :DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,

        }


});
module.exports = ConsultationSchema;

