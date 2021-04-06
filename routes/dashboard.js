const express = require("express");
const router = express.Router();
const passport = require("passport");

const config = require("../config.js");
const checkAuth = require("../modules/auth/checkAuth.js");
const debug = config.debug;

const SelfReloadJSON = require("self-reload-json");
const adminPassword = new SelfReloadJSON("./password.json");

// page d'acceuil du dash
router.get("/", checkAuth, function (req, res) {
  res.render("dashboardHome.ejs", {
    message: "",
    messageType: "error",
    user: req.user,
  });
});

module.exports = router;
