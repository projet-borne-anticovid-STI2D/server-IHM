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
const utils = require("./modules/utils/utils");
const SelfReloadJSON = require("self-reload-json");
const adminPassword = new SelfReloadJSON("./password.json");

let adminUser = {
  mail: "nomail@superbornecovid.me",
  username: "administrator",
  password: adminPassword.pass,
  admin: true,
  id: 0,
};

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
      console.log("[" + "LOADING".green + "]" + "[" + "MYSQL".yellow + "] " + "Database loaded in " + (finishTime - startTime) + "ms");
    });

  // webserver init
  const app = express();
  const http = require("http").createServer(app);
  const config = require("./config");
  let debug = config.debug;

  // init sessions stuff
  app.use(cookieParser(config.secret));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    expressSession({
      secret: config.secret,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // set static files path
  app.use("/", express.static("public"));

  // init our view engine
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  if (config.debug) {
    app.use(morgan("[" + "DEBUG".magenta + "] " + "[" + "REQUEST".green + "] " + ":method :url :status :res[content-length] - :response-time ms"));
  }

  // load our routes
  app.use("/", require("./routes/index"));
  app.use("/dashboard", require("./routes/dashboard"));

  // passportjs stuffs
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      if (debug) utils.logDebug("[" + "AUTH".red + "] " + "je cherche " + username);

      let user;

      if (username == "administrator") {
        user = adminUser;
      } // if it's a regular db user
      else {
        user = await db.users.findOne({ where: { mail: username } });
        if (!user) {
          if (debug) utils.logDebug("[" + "AUTH".red + "] " + "Je ne trouve pas db " + username);
          return done("Unknown account.", false);
        }
      }

      if (debug) utils.logDebug("[" + "AUTH".red + "] " + "User trouvé: " + JSON.stringify(user));
      // User not found
      if (!user) {
        if (debug) utils.logDebug("[" + "AUTH".red + "] " + "je ne trouve pas " + user);
        return done(null, false);
      }

      // Always use hashed passwords and fixed time comparison
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          return done(err);
        }
        if (!isValid) {
          if (debug) utils.logDebug("[" + "AUTH".red + "] " + "mdp de " + user.username + " faux");
          return done("Incorrect password.", false);
        }
        if (debug) utils.logDebug("[" + "AUTH".red + "] " + "mdp de " + user.username + " validé");
        return done(null, user);
      });
    })
  );
  passport.serializeUser(function (user, done) {
    if (debug) utils.logDebug("[" + "AUTH".red + "] " + "sérialise l'user " + user.username);
    done(null, user);
  });

  passport.deserializeUser(function (testuser, done) {
    if (testuser.username) {
      done(null, testuser);
    }

    //   if (debug) utils.logDebug("[" + "AUTH".red + "] " + "décé user pas trouvé");
  });

  // log informatif de démarrage terminé
  http.listen(config.port, () => {
    console.log("[STARTING] App started on port ".brightCyan + config.port);
  });
}
init();
