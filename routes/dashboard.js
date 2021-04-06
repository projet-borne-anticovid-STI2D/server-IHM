const express = require("express");
const router = express.Router();
const passport = require("passport");

const config = require("../config.js");
const checkAuth = require("../modules/auth/checkAuth.js");
const debug = config.debug;

const SelfReloadJSON = require("self-reload-json");
const db = require("../database/index.js");
const adminPassword = new SelfReloadJSON("./password.json");

// page d'acceuil du dash
router.get("/", checkAuth, async function (req, res) {
  let bornes = await db.bornes.findAll();
  if (!bornes[0]) {
    bornes = [];
  }

  res.render("dashboardHome.ejs", {
    message: "",
    messageType: "error",
    user: req.user,
    bornes,
  });
});

module.exports = router;
