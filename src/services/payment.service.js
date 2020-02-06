const { ApplicationUser, User, PaymentInformation } = require("../models");

function getApplicationUserByUserId(UserId) {
  return ApplicationUser.findOne({
    where: { UserId }
    // include: [{ model: User }]
  }).catch(err => console.log(err));
}

function addPaymentInformation(payInfo) {
  return PaymentInformation.create(payInfo).catch(err => console.log(err));
}

function getUserPaymentInformation(creditCardNumber, ownerReference) {
  return PaymentInformation.findOne({
    where: { creditCardNumber, ownerReference }
  }).catch(err => console.log(err));
}

function getUserPaymentInformations(ownerReference) {
  return PaymentInformation.findAll({ where: { ownerReference } }).catch(err =>
    console.log(err)
  );
}

function updateAppUser(user, data) {
  return user.update(data).catch(err => console.log(err));
}

module.exports = {
  getApplicationUserByUserId,
  addPaymentInformation,
  getUserPaymentInformation,
  getUserPaymentInformations,
  updateAppUser
};
