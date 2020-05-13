const Sequelize = require("sequelize");

const sequelize = new Sequelize("temp_auth_server", "root", "password", {
  host: "192.168.0.10",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
global.sequelize = sequelize;
