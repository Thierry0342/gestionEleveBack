var express = require("express");
var logger = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");


var indexRouter = require("./src/routes/index");

const DB = require("./src/data-access/database-connection");
//router
var eleve_router = require("./src/routes/eleve-route")


const { log } = require("console");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/eleve", eleve_router);

app.use('/uploads/pictures/images', express.static(path.join(__dirname, 'uploads/pictures/images')));


//association
require("./src/schemas/association");
DB.sync()
  .then((res) => {
    log("Database updated");
  })
  .catch((err) => {
    log(err);
  });
//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).send("404 not found");
  });
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.send("error");
  });
module.exports = app;