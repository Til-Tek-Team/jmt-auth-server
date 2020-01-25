const Sequelize = require("sequelize");

const sequelize = new Sequelize("auth_server_development", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
global.sequelize = sequelize;
