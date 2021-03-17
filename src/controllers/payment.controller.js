const { validatePaymentInfo } = require("../_helpers/validators");
const paymentService = require("../services/payment.service");
const userService = require("../services/user.service");
const depositService = require("../services/deposit.service");
const transactionService = require("../services/transaction.service");


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


//deposit
function deposit(req, res, next) {
  depositHandler(req.body)
    .then((deposit) =>
      deposit
        ? res.status(200).json({ success: true, deposit })
        : res.status(400).send({ success: false })
    )
    .catch((err) => next(err));
}

async function depositHandler(body) {
  const paymentInfo = await paymentService.getPaymentInfoById(body.id);
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

function buyVideoTransaction(req, res, next) {
  const { username, amount } = req.body;

  if (!username || !amount) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  buyVideoTransactionHandler(req.body)
    .then((transaction) =>
      transaction
        ? res.status(200).json({ success: true, transaction })
        : res.status(400).send({ success: false })
    )
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

async function buyVideoTransactionHandler(body) {
  let user = await userService.getUserByUserName(body.username);
  if (!user) throw "invalid request";

  let appUser = await paymentService.getApplicationUserByUserId(user.id);
  if (!appUser) throw "server error";

  const trans = await transactionService.addTransaction({
    amount: -body.amount,
    companyId: appUser.CompanyId,
  });

  if (!trans) throw "invalid request";
  return trans;
}

async function transactionsHandler(body) {
  const paymentInfo = await paymentService.getPaymentInfoById(body.id);
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

function balance(req, res, next) {
  balanceHandler(req.params.username)
    .then((balance) =>
      balance
        ? res.status(200).json({ success: true, balance })
        : res.status(400).send({ success: false })
    )
    .catch((err) => next(err));
}

async function balanceHandler(username) {
  let user = await userService.getUserByUserName(username);
  if (!user) throw "invalid request";

  let appUser = await paymentService.getApplicationUserByUserId(user.id);
  if (!appUser) throw "invalid request";

  const balnce = await paymentService.getCompanyBalance(appUser.companyId);
  if (balnce[0]) {
    return balnce[0].balance;
  }
  return "NO_BALANCE";
}

module.exports = {
  deposit,
  addTransactions,
  createPaymentInfo,
  getUserPaymentInfos,
  getPaymentInfo,
  balance,
  buyVideoTransaction,
};
