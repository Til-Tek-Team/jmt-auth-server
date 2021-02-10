const {
  validatePaymentInformation,
} = require("../_helpers/validators");
const uuid4 = require("uuid/v4");
const paymentService = require("../services/payment.service");
var moment = require("moment");

function addPaymentInformation(req, res, next) {
  const payInfo = req.body;
  let valid = validatePaymentInformation(payInfo);
  if (!valid) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  addPaymentInformationHandler(payInfo)
    .then(payment_information =>
      res.status(200).json({ success: true, payment_information })
    )
    .catch(err => next(err));
}

function getUserPaymentInformations(req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  getUserPaymentInformationsHandler(userId)
    .then(payment_informations =>
      res.status(200).json({ success: true, payment_informations })
    )
    .catch(err => next(err));
}

function buyPlan(req, res, next) {
  const { type, name, UserId } = req.body;

  if (!type || !name || !UserId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  buyPlanHandler(req.body)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

async function addPaymentInformationHandler(payInfo) {
  const user = await paymentService.getApplicationUserByUserId(payInfo.userId);

  if (!user) {
    throw "invalid request";
  }

  payInfo.ownerReference = user.CompanyId ? user.CompanyId : user.UserId;

  let foundCard = await checkCardUnique(
    payInfo.creditCardNumber,
    payInfo.ownerReference
  );

  if (foundCard) {
    throw "Information already registered for this user";
  }

  // payInfo.id = uuid4();
  const updatedUser = await paymentService.updateAppUser(user, {
    PaymentIdentifier: payInfo.ownerReference
  });
  const paymentInformation = await paymentService.addPaymentInformation(
    payInfo
  );
  if (!paymentInformation || !updatedUser) {
    throw "something went wrong";
  }

  return paymentInformation;
}

async function getUserPaymentInformationsHandler(userId) {
  const user = await paymentService.getApplicationUserByUserId(userId);
  if (!user) {
    throw "invalid request";
  }

  if (!user.PaymentIdentifier) {
    return [];
  }

  const paymentInfos = await paymentService.getUserPaymentInformations(
    user.PaymentIdentifier
  );
  if (!paymentInfos) {
    throw "something went wrong";
  }

  return paymentInfos;
}




async function checkCardUnique(creditCardNumber, ownerReference) {
  const foundCard = await paymentService.getUserPaymentInformation(
    creditCardNumber,
    ownerReference
  );
  return !!foundCard;
}


module.exports = {
  addPaymentInformation,
  getUserPaymentInformations,
  buyPlan,
};
