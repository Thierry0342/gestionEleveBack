var express = require("express");
var logger = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");


var indexRouter = require("./src/routes/index");

const DB = require("./src/data-access/database-connection");
//router
var eleve_router = require("./src/routes/eleve-route")
var cour_route = require("./src/routes/cour-route")
var user_route = require("./src/routes/user-route");
var absence_route=require("./src/routes/absence-route");
var cadre_route = require("./src/routes/cadre-route");
var consultation_route=require("./src/routes/consultation-route");
var Pointure_route = require("./src/routes/pointure-route");
var spaSpeciale_route=require("./src/routes/spaSpeciale-route")
const sequelize = require('./src/data-access/database-connection');
var permission_route = require('./src/routes/permission-route');
const logRoutes = require("./src/routes/logs-route");
const logMiddleware = require('./src/middlewares/logMiddleware');
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
// Utiliser le middleware pour toutes les routes
app.use(logMiddleware);


app.use("/api/eleve", eleve_router);
app.use("/api/cour",cour_route);
app.use("/api/user",user_route);
app.use("/api/absence",absence_route);
app.use("/api/cadre",cadre_route);
app.use("/api/consultation",consultation_route);
app.use("/api/logs",logRoutes);
app.use("/api/pointures",Pointure_route);
app.use("/api/spaSpeciale",spaSpeciale_route);
app.use("/api/permission",permission_route);

app.use('/data/uploads', express.static(path.join(__dirname, 'public/data/uploads')));

//association

//await sequelize.sync({ alter: true });

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