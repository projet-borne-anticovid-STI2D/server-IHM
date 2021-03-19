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

async function init() {
  const app = express();
  const http = require("http").createServer(app);
  const config = require("./config");

  // set static files path
  app.use("/", express.static("public"));

  // init our view engine
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  if (config.debug) {
    app.use(morgan("[" + "DEBUG".magenta + "] " + "[" + "REQUEST".green + "] " + ":method :url :status :res[content-length] - :response-time ms"));
  }

  // log informatif de démarrage terminé
  http.listen(config.port, () => {
    console.log("[STARTING] App started on port ".brightCyan + config.port);
  });
}
init();
