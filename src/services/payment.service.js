const {
  ApplicationUser,
  User,
  PaymentInformation,
  PaymentPlanTypes,
  Subscription,
  SubscriptionTransaction,
  Company,Application,Balance
} = require("../models");

function getApplicationUserByUserId(UserId) {
  return ApplicationUser.findOne({
    where: { UserId }
  }).catch(err => console.log(err));
}

function getApplicationUserByUserIdAndApplication(UserId, ApplicationId) {
  return ApplicationUser.findOne({
    where: { UserId, applicationApplicationId: ApplicationId }
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

async function updateSubscriptionById(id, data) {
  let subscriptions = await Subscription.findOne({ where: { id } }).catch(err =>
    console.log(err)
  );
  return subscriptions.update(data).catch(err => console.log(err));
}

function updateSubscription(subscription, data) {
  return subscription.update(data).catch(err => console.log(err));
}

function addSubscription(subscription) {
  return Subscription.create(subscription).catch(err => console.log(err));
}

function getSubscription(PaymentId) {
  return Subscription.findOne({ where: { PaymentId } }).catch(err =>
    console.log(err)
  );
}

function getSubscriptionById(id) {
  return Subscription.findOne({ where: { id } }).catch(err => console.log(err));
}

function getSubscriptionTransactionById(id) {
  return SubscriptionTransaction.findOne({
    where: { id },
    include: [
      { model: ApplicationUser, include: [{ model: User }, { model: Company }] }
    ]
  }).catch(err => console.log(err));
}

function getCountSubscriptionTransaction(companyId){
  let query = `SELECT count(*) as count FROM view_payment_transcation t left join subscription_transactions sb on sb.id = t.transactionId WHERE t.CompanyId='${companyId}'`
  // let query = `select * from view_payment_transcation left join  where CompanyId = '${companyId}'`
  return sequelize.query(query,
    { type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.log(err));
}

function getSubscriptionTransactionByCompanyId(companyId,offset,limit){
  let query = `SELECT t.credit as credit,t.debit as debit,t.type, sb.transactionFrom,sb.transactionTo,t.CompanyId,t.transactionDate,sb.paidBy FROM view_payment_transcation t left join subscription_transactions sb on sb.id = t.transactionId WHERE t.CompanyId='${companyId}' order by transactionDate Desc  limit ${offset},${limit}`
  // let query = `select * from view_payment_transcation left join  where CompanyId = '${companyId}'`
  
  return sequelize.query(query,
    { type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.log(err));
}

function addSubscriptionTransaction(subscriptionTrans) {
  return SubscriptionTransaction.create(subscriptionTrans).catch(err =>
    console.log(err)
  );
}

function getAllSubscription(ApplicationId) {
  return SubscriptionTransaction.findAll({
    include: [
      { model: ApplicationUser, include: [{ model: User }, { model: Company }] }
    ]
  }).catch(err => console.log(err));
}

function updateApplicationUser(appUser, data) {
  return appUser.update(data).catch(err => console.log(err));
}

function updateconfirmPaymentField(id,paid,name,amount){
  return SubscriptionTransaction.update({paid:paid,paidBy:name,paidAmount:amount},{where: { id }}).catch(err => console.log(err));
}

function addAmountBalance(balance){
  return Balance.create(balance).catch(err => console.log(err));
}

function getBalanceByCompanyId(compId){
  let query = `select sum(credit) as balance,sum(debit) as purchased from view_payment_transcation where CompanyId ='${compId}'`;
  return sequelize.query(query,
    { type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.log(err));
}



function depositMoney(account,data){
  return account.update({balance:data}).catch(err => console.log(err))
}
function addCompany(company) {
  return Company.create(company).catch(err => console.log(err));
}

function getPaymentPlanTypes() {
  return PaymentPlanTypes.findAll({
    order: [["amount", "ASC"]]
  }).catch(err => console.log(err));
}

function createPaymentPlanType(plan_type) {
  return PaymentPlanTypes.create(plan_type).catch(err => console.log(err));
}

function updatePaymentPlanType(plan_type, obj) {
  return plan_type.update(obj).catch(err => console.log(err));
}

function getPaymentTypeById(id) {
  return PaymentPlanTypes.findOne({ where: { id } }).catch(err =>
    console.log(err)
  );
}

module.exports = {
  getApplicationUserByUserId,
  addPaymentInformation,
  getUserPaymentInformation,
  getUserPaymentInformations,
  updateAppUser,
  getPaymentType,
  updateSubscription,
  updateSubscriptionById,
  addSubscription,
  getSubscription,
  addSubscriptionTransaction,
  getApplicationUserByUserIdAndApplication,
  getAllSubscription,
  getSubscriptionById,
  updateApplicationUser,
  addCompany,
  getSubscriptionTransactionById,
  getSubscriptionTransactionByCompanyId,
  updateconfirmPaymentField,
  addAmountBalance,
  depositMoney,
  getBalanceByCompanyId,
  getCountSubscriptionTransaction,
  getPaymentPlanTypes,
  createPaymentPlanType,
  updatePaymentPlanType,
  getPaymentTypeById
};
