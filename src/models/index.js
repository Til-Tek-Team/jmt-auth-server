const sequelize = require("../database/connection");

const User = sequelize.import("./users.js");
const Token = sequelize.import("./token.js");
const Application = sequelize.import("./application.js");
const ApplicationUser = sequelize.import("./applicationUser.js");

User.hasMany(ApplicationUser);
Application.hasMany(ApplicationUser);

ApplicationUser.belongsTo(User);
ApplicationUser.belongsTo(Application);

module.exports = {
  User,
  Token,
  Application,
  ApplicationUser
};
