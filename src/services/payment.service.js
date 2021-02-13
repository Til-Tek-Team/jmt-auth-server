const {
  ApplicationUser,
  User,
  PaymentInformation,
  Company,
  Application,
  PaymentInfo,
} = require("../models");
const { QueryTypes } = require("sequelize");
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

function createPaymentInfo(paymentInfo) {
  return PaymentInfo.create(paymentInfo).catch((err) => console.log(err));
}

function getUserPaymentInfos(companyId) {
  return PaymentInfo.findAll({ where: { companyId } }).catch((err) =>
    console.log(err)
  );
}

function getPaymentInfoById(id) {
  return PaymentInfo.findOne({ where: { id } }).catch((err) =>
    console.log(err)
  );
}

function getCompanyBalance(companyId) {
  return sequelize.query(
    `SELECT balance FROM view_balance where companyId='${companyId}'`,
    { type: QueryTypes.SELECT }
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
  createPaymentInfo,
  getUserPaymentInfos,
  getPaymentInfoById,
  getCompanyBalance,
};
