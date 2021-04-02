const express = require("express");
const router = express.Router();

const config = require("../config.js");
const checkAuth = require("../modules/auth/checkAuth.js");
const debug = config.debug;

const SelfReloadJSON = require("self-reload-json");
const adminPassword = new SelfReloadJSON("./password.json");

// pour ne pas afficher une page vide moche
router.get("/", checkAuth, function (req, res) {
  res.render("main.ejs", {});
});

// pour ne pas afficher une page vide moche
router.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.render("login.ejs", {});
});

// pour ne pas afficher une page vide moche
router.post("/login", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.render("login.ejs", {});
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    let hasPass = false;
    if (!config.passwordHash == "") hasPass = true;

    if (!user) {
      return res.render("login", {
        message: "Wrong password",
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

module.exports = router;
