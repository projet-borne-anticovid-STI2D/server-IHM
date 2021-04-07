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
  res.render("dashboardHome.ejs", {
    message: "",
    messageType: "error",
    user: req.user,
    bornes: await getBornes(),
    borneSelected: undefined,
  });
});

// page d'acceuil du dash
router.get("/borne/:id", checkAuth, async function (req, res) {
  res.render("borne.ejs", {
    message: "",
    messageType: "error",
    user: req.user,
    bornes: await getBornes(),
    borneSelected: await getBorne(req.params.id),
  });
});

/**
 * Gives the bornes list
 * @returns bornes[]
 */
async function getBornes() {
  let bornes = await db.bornes.findAll();
  if (!bornes[0]) {
    bornes = [];
  }
  return bornes;
}

/**
 * Gives the borne object from an id
 * @argument id
 * @returns borne
 */
async function getBorne(id) {
  let borne = await db.bornes.findOne({ where: { id: id } });

  return borne;
}

module.exports = router;
