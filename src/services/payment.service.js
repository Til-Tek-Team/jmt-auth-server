const {
  ApplicationUser,
  User,
  PaymentInformation,
  PaymentPlanTypes,
  Subscription,
  SubscriptionTransaction
} = require("../models");

function getApplicationUserByUserId(UserId) {
  return ApplicationUser.findOne({
    where: { UserId }
  }).catch(err => console.log(err));
}

function getApplicationUserByUserIdAndApplication(UserId, ApplicationId) {
  return ApplicationUser.findOne({
    where: { UserId, ApplicationId }
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

function getPaymentType(name) {
  return PaymentPlanTypes.findOne({ where: { name } }).catch(err =>
    console.log(err)
  );
}

async function updateSubscription(id, data) {
  let subscriptions = await Subscription.findOne({where: { id }}).catch(err => console.log(err));
  return subscriptions.update(data).catch(err => console.log(err));
}

function addSubscription(subscription) {
  return Subscription.create(subscription).catch(err => console.log(err));
}

function getSubscription(PaymentId) {
  return Subscription.findOne({ where: { PaymentId } }).catch(err =>
    console.log(err)
  );
}

function getSubscriptionById(id){
  return Subscription.findOne({ where: { id } }).catch(err =>
    console.log(err)
  );
}

function addSubscriptionTransaction(subscriptionTrans) {
  return SubscriptionTransaction.create(subscriptionTrans).catch(err =>
    console.log(err)
  );
}

function getAllSubscription(ApplicationId) {
  return SubscriptionTransaction.findAll().catch(err => console.log(err));
}

module.exports = {
  getApplicationUserByUserId,
  addPaymentInformation,
  getUserPaymentInformation,
  getUserPaymentInformations,
  updateAppUser,
  getPaymentType,
  updateSubscription,
  addSubscription,
  getSubscription,
  addSubscriptionTransaction,
  getApplicationUserByUserIdAndApplication,
  getAllSubscription,
  getSubscriptionById
};
