const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const DB = new Sequelize({
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

function checkingDB() {
  return connection.query(
    "CREATE DATABASE IF NOT EXISTS " + process.env.DB_NAME + ";",
    function (err, res) {
      console.log(res);
    }
  );
}

(module.exports = DB), checkingDB();
