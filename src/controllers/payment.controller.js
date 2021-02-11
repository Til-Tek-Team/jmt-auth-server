const { validatePaymentInformation, validatePaymentInfo } = require("../_helpers/validators");
const uuid4 = require("uuid/v4");
const paymentService = require("../services/payment.service");
const userService = require("../services/user.service");
var moment = require("moment");
const depositService = require("../services/deposit.service");
const transactionService = require("../services/transaction.service");

function addPaymentInformation(req, res, next) {
  const payInfo = req.body;
  let valid = validatePaymentInformation(payInfo);
  if (!valid) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  addPaymentInformationHandler(payInfo)
    .then((payment_information) => res.status(200).json({ success: true, payment_information }))
    .catch((err) => next(err));
}

function createPaymentInfo(req, res, next) {
  const paymentInfo = req.body;
  let valid = validatePaymentInfo(paymentInfo);
  // console.log(valid);
  if (!valid) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  createPaymentInfoHandler(paymentInfo)
    .then((payment_info) => res.status(200).json({ success: true, payment_info }))
    .catch((err) => next(err));
}

function getUserPaymentInfos(req, res, next) {
  let { username } = req.params;

  if (!username) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  getUserPaymentInfosHandler(username)
    .then((payment_infos) => res.status(200).json({ success: true, payment_infos }))
    .catch((err) => next(err));
}

function getPaymentInfo(req, res, next) {
  let { paymentInfoId } = req.params;

  if (!paymentInfoId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  getPaymentInfoHandler(paymentInfoId)
    .then((payment_info) => res.status(200).json({ success: true, payment_info }))
    .catch((err) => next(err));
}

async function getPaymentInfoHandler(paymentInfoId) {
  let paymentInfo = await paymentService.getPaymentInfoById(paymentInfoId);
  if (!paymentInfo) throw "invalid request";

  return paymentInfo;
}

async function getUserPaymentInfosHandler(username) {
  let user = await userService.getUserByUserName(username);
  if (!user) throw "invalid request";

  let appUser = await paymentService.getApplicationUserByUserId(user.id);
  if (!appUser) throw "invalid request";

  let paymentInfos = await paymentService.getUserPaymentInfos(
    appUser.CompanyId ? appUser.CompanyId : appUser.UserId
  );
  if (!paymentInfos) throw "server error";

  return paymentInfos;
}

function getUserPaymentInformations(req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  getUserPaymentInformationsHandler(userId)
    .then((payment_informations) => res.status(200).json({ success: true, payment_informations }))
    .catch((err) => next(err));
}

function buyPlan(req, res, next) {
  const { type, name, UserId } = req.body;

  if (!type || !name || !UserId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  buyPlanHandler(req.body)
    .then((subscription) => res.status(200).json({ success: true, subscription }))
    .catch((err) => next(err));
}

async function createPaymentInfoHandler(paymentInfo) {
  let user = await userService.getUserByUserName(paymentInfo.username);
  if (!user) throw "invalid request";

  let appUser = await paymentService.getApplicationUserByUserId(user.id);
  if (!appUser) throw "invalid request";

  let dbPaymentInfo = await paymentService.createPaymentInfo({
    ...paymentInfo,
    companyId: appUser.CompanyId ? appUser.CompanyId : appUser.UserId,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  if (!dbPaymentInfo) return "server error";
  return dbPaymentInfo;
}

async function addPaymentInformationHandler(payInfo) {
  const user = await paymentService.getApplicationUserByUserId(payInfo.userId);

  if (!user) {
    throw "invalid request";
  }

  payInfo.ownerReference = user.CompanyId ? user.CompanyId : user.UserId;

  let foundCard = await checkCardUnique(payInfo.creditCardNumber, payInfo.ownerReference);

  if (foundCard) {
    throw "Information already registered for this user";
  }

  // payInfo.id = uuid4();
  const updatedUser = await paymentService.updateAppUser(user, {
    PaymentIdentifier: payInfo.ownerReference,
  });
  const paymentInformation = await paymentService.addPaymentInformation(payInfo);
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

  const paymentInfos = await paymentService.getUserPaymentInformations(user.PaymentIdentifier);
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

//deposit
function deposit(req, res, next) {
  depositHandler(req.body)
    .then((deposit) =>
      deposit
        ? res.status(400).send({ success: false })
        : res.status(200).json({ success: true, deposit })
    )
    .catch((err) => next(err));
}

async function depositHandler(body) {
  const paymentInfo = await paymentService.getPaymentById(body.id);
  if (paymentInfo) {
    const deposit = await depositService.addDesposit({
      deposit: body.amount,
      companyId: paymentInfo.companyId,
      userId: paymentInfo.userId,
      paymentInfoId: paymentInfo.id,
    });
    if (deposit) {
      return deposit;
    }
  }
}

function addTransactions(req, res, next) {
  transactionsHandler(req.body)
    .then((transactions) =>
      transactions
        ? res.status(400).send({ success: false })
        : res.status(200).json({ success: true, deposit })
    )
    .catch((err) => next(err));
}

async function transactionsHandler(body) {
  const paymentInfo = await paymentService.getPaymentById(body.id);
  if (paymentInfo) {
    const trans = await transactionService.addTransaction({
      amount: body.amount,
      companyId: paymentInfo.companyId,
      paymentInfoId: paymentInfo.id,
    });
    if (trans) {
      return trans;
    }
  }
}

module.exports = {
  addPaymentInformation,
  getUserPaymentInformations,
  buyPlan,
  deposit,
  addTransactions,
  createPaymentInfo,
  getUserPaymentInfos,
  getPaymentInfo,
};
