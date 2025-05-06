const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

const UserSchema = sequelize.define("User",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username:{
        type: DataTypes.STRING,
        allowNull: false,

      },
      password:{
        type:DataTypes.STRING,
        allowNull: false

      },
      type:{
        type:DataTypes.STRING,
        allowNull:false,

      }
      

});

module.exports = UserSchema;

