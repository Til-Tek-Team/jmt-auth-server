const Sequelize = require("sequelize");

const sequelize = new Sequelize("auth_server_payment", "root", "password", {
  host: "192.168.0.10",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
global.sequelize = sequelize;
