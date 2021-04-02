const colors = require("colors"); // pour avoir une belle console
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const expressSession = require("express-session");
const express = require("express");
const morgan = require("morgan");

const LocalStrategy = require("passport-local").Strategy;

const db = require("./database");
const SelfReloadJSON = require("self-reload-json");
const adminPassword = new SelfReloadJSON("./password.json");

async function init() {
  // database init
  // prepare database
  let startTime = Date.now();
  await db.sequelize
    .sync({
      alter: true,
      logging: false,
    })
    .then(() => {
      finishTime = Date.now();
      console.log(
        "[" +
          "LOADING".green +
          "]" +
          "[" +
          "MYSQL".yellow +
          "] " +
          "Database loaded in " +
          (finishTime - startTime) +
          "ms"
      );
    });

  // webserver init
  const app = express();
  const http = require("http").createServer(app);
  const config = require("./config");

  // set static files path
  app.use("/", express.static("public"));

  // init our view engine
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  if (config.debug) {
    app.use(
      morgan(
        "[" +
          "DEBUG".magenta +
          "] " +
          "[" +
          "REQUEST".green +
          "] " +
          ":method :url :status :res[content-length] - :response-time ms"
      )
    );
  }

  // load our routes
  app.use("/", require("./routes/index"));

  // passportjs stuffs

  passport.serializeUser(function (user, done) {
    if (debug)
      utils.logDebug(
        "[" + "AUTH".red + "] " + "sérialise l'user " + user.username
      );
    done(null, user);
  });

  passport.deserializeUser(function (testuser, done) {
    let user = {
      username: "user",
      passwordHash: config.passwordHash,
      id: 1,
    };

    if (debug)
      utils.logDebug(
        "[" + "AUTH".red + "] " + "désérialise l'user " + testuser.username
      );

    if (user.username == testuser.username) {
      done(null, user);
    } else {
      if (debug)
        utils.logDebug("[" + "AUTH".red + "] " + "décé user pas trouvé");
      done("cc", user);
    }
  });

  // log informatif de démarrage terminé
  http.listen(config.port, () => {
    console.log("[STARTING] App started on port ".brightCyan + config.port);
  });
}
init();
