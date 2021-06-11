const sequelize = require("../database/connection");

const User = sequelize.import("./users.js");
const Token = sequelize.import("./token.js");
const Application = sequelize.import("./application.js");
const ApplicationUser = sequelize.import("./applicationUser.js");
const Company = sequelize.import("./company.js");
const Deposit = sequelize.import("./deposit.js");
const Transaction = sequelize.import("./transaction.js");
const PaymentInfo = sequelize.import("./paymentInfo.js");

ApplicationUser.belongsTo(User);
User.hasMany(ApplicationUser);
ApplicationUser.belongsTo(Company);

Company.belongsTo(Application);
Application.hasMany(Company);

module.exports = {
  User,
  Token,
  Application,
  ApplicationUser,
  Company,
  Transaction,
  Deposit,
  PaymentInfo
};
