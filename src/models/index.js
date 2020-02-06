const sequelize = require("../database/connection");

const User = sequelize.import("./users.js");
const Token = sequelize.import("./token.js");
const Application = sequelize.import("./application.js");
const ApplicationUser = sequelize.import("./applicationUser.js");
const PaymentInformation = sequelize.import("./paymentInformation.js");
const Company = sequelize.import("./company.js");
const Subscription = sequelize.import("./subscription.js");
const SubscriptionTransaction = sequelize.import(
  "./subscriptionTransaction.js"
);

ApplicationUser.belongsTo(User);
User.hasMany(ApplicationUser);

// ApplicationUser.belongsTo(Application);
// Application.hasMany(ApplicationUser);

SubscriptionTransaction.belongsTo(ApplicationUser);
ApplicationUser.hasMany(SubscriptionTransaction);

SubscriptionTransaction.belongsTo(PaymentInformation);
PaymentInformation.hasMany(SubscriptionTransaction);

Subscription.belongsTo(PaymentInformation);
PaymentInformation.hasMany(Subscription);

Company.belongsTo(Application);
Application.hasMany(Company);

module.exports = {
  User,
  Token,
  Application,
  ApplicationUser,
  PaymentInformation,
  Company,
  Subscription,
  SubscriptionTransaction
};
