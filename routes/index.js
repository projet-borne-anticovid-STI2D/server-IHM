const express = require("express");
const router = express.Router();
const passport = require("passport");

const config = require("../config.js");
const checkAuth = require("../modules/auth/checkAuth.js");
const debug = config.debug;

const SelfReloadJSON = require("self-reload-json");
const adminPassword = new SelfReloadJSON("./password.json");

// page d'acceuil du truc
router.get("/", checkAuth, function (req, res) {
  res.redirect("/dashboard");
});

// page de login
router.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }

  res.render("login.ejs", {
    message: "",
    messageType: "error",
  });
});

// réception des requetes de login
router.post("/login", function (req, res, next) {
  console.log(req.body);
  passport.authenticate("local", function (err, user, info) {
    let hasPass = false;
    if (!config.passwordHash == "") hasPass = true;

    if (err) {
      return res.render("login", {
        message: err,
        messageType: "error",
        hasPass: hasPass,
      });
    }

    if (!user) {
      return res.render("login", {
        message: "Pas d'utilisateur",
        messageType: "error",
        hasPass: hasPass,
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

// lien de déconnection
router.get("/logout", checkAuth, (req, res) => {
  if (req.session.passport == undefined) {
    res.redirect("/");
  } else {
    if (debug) utils.logDebug("Déco de " + req.session.passport.user.username);

    req.session.destroy(function (err) {
      res.redirect("/"); //Inside a callback… bulletproof!
    });
  }
});

module.exports = router;
