const config = require("../config.js");
const dbConfig = config.database;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,

  operatorsAliases: false,

  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./models/users.model.js")(sequelize, Sequelize);
db.bornes = require("./models/bornes.model.js")(sequelize, Sequelize);

module.exports = db;
