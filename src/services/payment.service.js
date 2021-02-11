const {
  ApplicationUser,
  User,
  PaymentInformation,
  Company,
  Application,
} = require("../models");

function getApplicationUserByUserId(UserId) {
  return ApplicationUser.findOne({
    where: { UserId },
  }).catch((err) => console.log(err));
}

function getApplicationUserByUserIdAndApplication(UserId, ApplicationId) {
  return ApplicationUser.findOne({
    where: { UserId, applicationApplicationId: ApplicationId },
  }).catch((err) => console.log(err));
}

function addPaymentInformation(payInfo) {
  return PaymentInformation.create(payInfo).catch((err) => console.log(err));
}

function getUserPaymentInformation(creditCardNumber, ownerReference) {
  return PaymentInformation.findOne({
    where: { creditCardNumber, ownerReference },
  }).catch((err) => console.log(err));
}

function getUserPaymentInformations(ownerReference) {
  return PaymentInformation.findAll({
    where: { ownerReference },
  }).catch((err) => console.log(err));
}

function updateAppUser(user, data) {
  return user.update(data).catch((err) => console.log(err));
}

function updateApplicationUser(appUser, data) {
  return appUser.update(data).catch((err) => console.log(err));
}

function addCompany(company) {
  return Company.create(company).catch((err) => console.log(err));
}

function getPaymentById(id) {
  return PaymentInformation.findOne({ where: { id } }).catch((err) =>
    console.log(err)
  );
}

module.exports = {
  getApplicationUserByUserId,
  addPaymentInformation,
  getUserPaymentInformation,
  getUserPaymentInformations,
  updateAppUser,
  getApplicationUserByUserIdAndApplication,
  updateApplicationUser,
  addCompany,
  getPaymentById,
};
