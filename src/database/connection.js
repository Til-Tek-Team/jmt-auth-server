const Sequelize = require("sequelize");

const sequelize = new Sequelize("jmt_auth_server", "root", "password", {
  host: "192.168.0.10",
  dialect: "mysql",
  logging: console.log,
});

module.exports = sequelize;
global.sequelize = sequelize;
