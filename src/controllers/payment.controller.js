const { validatePaymentInformation } = require("../_helpers/validators");
const uuid4 = require("uuid/v4");
const paymentService = require("../services/payment.service");
const userService = require("../services/user.service");
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

function getSubscription(req, res, next) {
  const { UserId, ApplicationId } = req.params;

  if (!UserId || !ApplicationId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  getSubscriptionHandler(UserId, ApplicationId)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

function getAllSubscriptionById(req, res, next) {
  const { id } = req.params;
  if (!id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  // console.log(id)
  getSubscriptionByIdHandler(id)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

function payFromBalance(req, res, next) {
  const { id } = req.params;
  if (!id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  payBalanceHandler(id)
    .then(balance => res.status(200).json({ success: true, balance }))
    .catch(err => next(err));
}

function payExemptByCompId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  payExemptHandler(req.params.id, req.body)
    .then(balance => res.status(200).json({ success: true, balance }))
    .catch(err => next(err));
}

function getBalance(req, res, next) {
  const { id } = req.params;
  if (!id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  getBalanceHandler(id)
    .then(balance => res.status(200).json({ success: true, balance }))
    .catch(err => next(err));
}

function getAllSubscriptionByCompId(req, res, next) {
  const { compId } = req.params;
  if (!compId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  getSubscriptionByCompIdHandler(compId,req.query.page || 0, req.query.pageSize || 5)
    .then(subscription => res.status(200).json({ success: true, subscription }))
    .catch(err => next(err));
}

function getAllSubscription(req, res, next) {
  const { ApplicationId } = req.params;

  if (!ApplicationId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  getAllSubscriptionHanlder(ApplicationId)
    .then(subscriptions =>
      res.status(200).json({ success: true, subscriptions })
    )
    .catch(err => next(err));
}

function purchaseBySubscriptionId(req, res, next) {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  purchaseCV(subscriptionId)
    .then(subscriptions =>
      res.status(200).json({ success: true, subscriptions })
    )
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

async function buyPlanHandler(data) {
  const user = await paymentService.getApplicationUserByUserId(data.UserId);

  if (!user) {
    throw "user does not exist";
  }

  const PaymentIdentifier = user.CompanyId ? user.CompanyId : user.UserId;

  const payType = await paymentService.getPaymentType(data.name);

  if (!payType || !payType.name) {
    throw "invalid request";
  }

  let tempSub = await paymentService.getSubscription(PaymentIdentifier);
  let oldSubscription = tempSub ? { ...tempSub.dataValues } : null;
  let subscription = tempSub ? tempSub : {};
  subscription["type"] = payType.type;
  subscription["PaymentId"] = PaymentIdentifier;
  subscription["createdAt"] = subscription.createdAt
    ? subscription.createdAt
    : new Date()
        .toISOString()
        .split(".")[0]
        .replace("T", " ");
  subscription["updatedAt"] = new Date()
    .toISOString()
    .split(".")[0]
    .replace("T", " ");

  if (payType.type == "EXPRESS") {
    subscription["points"] = subscription.points
      ? subscription.points + payType.valueInPoints
      : payType.valueInPoints;
    subscription["expressType"] = payType.name;
    subscription["expirationDate"] = null;
    subscription["premiumType"] = null;
  } else {
    subscription["expirationDate"] =
      subscription.expirationDate &&
      subscription.expirationDate >
        new Date()
          .toISOString()
          .split(".")[0]
          .replace("T", " ")
        ? new Date(
            new Date(subscription.expirationDate).getTime() +
              24 * 60 * 60 * 1000 * payType.valueInDays
          )
            .toISOString()
            .split(".")[0]
            .replace("T", " ")
        : new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000 * payType.valueInDays
          )
            .toISOString()
            .split(".")[0]
            .replace("T", " ");
    subscription["premiumType"] = payType.name;
    subscription["points"] = null;
    subscription["expressType"] = null;
  }

  // console.log(subscription);

  let newSub;
  let trans;
  if (tempSub) {
    trans = await addSubscriptionTransaction(
      subscription,
      oldSubscription,
      user.id,
      PaymentIdentifier,
      payType.amount
    );
    newSub = await paymentService.updateSubscription(
      tempSub,
      subscription.dataValues
    );
  } else {
    trans = await addSubscriptionTransaction(
      subscription,
      oldSubscription,
      user.id,
      PaymentIdentifier,
      payType.amount
    );
    newSub = await paymentService.addSubscription(subscription);
  }

  if (!newSub || !trans) {
    throw "something went wrong";
  }

  return newSub;
}

async function getSubscriptionHandler(UserId, ApplicationId) {
  const appUser = await paymentService.getApplicationUserByUserIdAndApplication(
    UserId,
    ApplicationId
  );
  if (!appUser) {
    throw "user does not exist";
  }

  const sub = await paymentService.getSubscription(
    appUser.CompanyId ? appUser.CompanyId : appUser.UserId
  );

  if (!sub) {
    throw "use do not have subscription";
  }

  return sub;
}

async function getSubscriptionByIdHandler(id) {
  const sub = await paymentService.getSubscriptionTransactionById(id);

  if (!sub) {
    throw "use do not have subscription";
  }
  return sub;
}

async function getBalanceHandler(id) {
  const balance = await paymentService.getBalanceByCompanyId(id);
  if (balance) {
    return balance;
  } else {
    return 0;
  }
}

async function payExemptHandler(id, body) {
  // console.log(body);
  const subscriptions = await paymentService.getSubscriptionTransactionByCompanyId(
    id
  );
  if (subscriptions) {
    subscriptions.map(subs => {
      // console.log(subs.amount);
      if (!subs.paid) {
        const update = paymentService.updateconfirmPaymentField(
          subs.id,
          1,
          body.name,
          subs.amount
        );
      }
    });
    return true;
  }
}

async function payBalanceHandler(id) {
  const balance = await paymentService.getBalanceByCompanyId(id);
  // console.log(balance.balance);
  if (balance) {
    const subscriptions = await paymentService.getSubscriptionTransactionByCompanyId(
      id
    );
    let countAmount = 0;
    if (subscriptions) {
      subscriptions.map(subs => {
        // console.log(subs.amount);
        if (!subs.paid) {
          countAmount = countAmount + subs.amount - subs.paidAmount;
        }
      });
      // console.log(countAmount);
      if (parseInt(balance.balance) < parseInt(countAmount)) {
        throw "In sufficient Balance";
      } else if (parseInt(balance.balance) >= parseInt(countAmount)) {
        subscriptions.map(subs => {
          if (!subs.paid) {
            const update = paymentService.updateconfirmPaymentField(
              subs.id,
              1,
              "Admin",
              subs.amount
            );
          }
        });

        let balanceBody = {};
        balanceBody.balance = parseInt(balance.balance) - parseInt(countAmount);
        balanceBody.CompanyId = id;
        const balance1 = await paymentService.addAmountBalance(balanceBody);
        return true;
      }
    }
  }
  // const balance = await paymentService.paySubsFromBalance(id);
  // if(balance){
  //   return balance
  // }else{
  //   return 0;
  // }
}

async function getSubscriptionByCompIdHandler(id,offset,limit) {
  // console.log(offset,limit)
  const sub = await paymentService.getSubscriptionTransactionByCompanyId(id,offset,limit);
  const total = await paymentService.getCountSubscriptionTransaction(id);
 
  let totalItems;
   if(total){
    totalItems = Object.values(total[0])[0];
  }
  if (!sub) {
    throw "use do not have subscription";
  }
  return {sub,total:totalItems};
}

async function getAllSubscriptionHanlder(ApplicationId) {
  const subscriptions = await paymentService.getAllSubscription(ApplicationId);

  if (!subscriptions) {
    throw "something went wrong";
  }

  return subscriptions;
}

async function checkCardUnique(creditCardNumber, ownerReference) {
  const foundCard = await paymentService.getUserPaymentInformation(
    creditCardNumber,
    ownerReference
  );
  return !!foundCard;
}

async function addSubscriptionTransaction(
  newSub,
  oldSub,
  UserId,
  PaymentId,
  amount
) {
  let subTransaction = {};
  subTransaction.transactionFrom = oldSub
    ? oldSub.type == "EXPRESS"
      ? oldSub.expressType
      : oldSub.premiumType
    : "NONE";
  subTransaction.transactionTo =
    newSub.type == "EXPRESS" ? newSub.expressType : newSub.premiumType;
  subTransaction.applicationUserId = UserId;
  subTransaction.paymentInformationId = PaymentId;
  subTransaction.createdAt = new Date()
    .toISOString()
    .split(".")[0]
    .replace("T", " ");
  subTransaction.updatedAt = new Date()
    .toISOString()
    .split(".")[0]
    .replace("T", " ");

  subTransaction.amount = amount;

  const savedTrans = await paymentService.addSubscriptionTransaction(
    subTransaction
  );

  if (!savedTrans) {
    return false;
  }

  return true;
}

async function purchaseCV(subscriptionId) {
  const CVPOINT = 30;
  const subscription = await paymentService.getSubscriptionById(subscriptionId);

  if (subscription && subscription.type == "EXPRESS") {
    if (subscription.points > 31) {
      const points = parseInt(subscription.points) - parseInt(CVPOINT);
      const updateSubscription = await paymentService.updateSubscriptionById(
        subscription.id,
        { points }
      );
      if (updateSubscription) {
        return updateSubscription;
      }
    }
  } else if (subscription && subscription.type == "PREMIUM") {
    const today = moment().format();
    if (subscription.expirationDate >= today) {
      return subscription;
    }
  }
}
function confirmPayment(req, res, next) {
  confirmPaymentById(req.params.id, req.body)
    .then(payment =>
      payment
        ? res.status(200).json({ success: true, payment })
        : res
            .status(200)
            .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next(err));
}

function depositMoney(req, res, next) {
  depositMoneyForCompany(req.body)
    .then(deposit =>
      deposit
        ? res.status(200).json({ success: true, deposit })
        : res
            .status(200)
            .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next(err));
}

async function depositMoneyForCompany(body) {
  let balanceBody = {};
  balanceBody.balance = body.body.amount;
  balanceBody.CompanyId = body.compId;
  const addBalance = await paymentService.addAmountBalance(balanceBody);
  // console.log(addBalance)
  if (addBalance) {
    return addBalance;
  }
}

async function confirmPaymentById(id, body) {
  const confirmPayment = await paymentService.getSubscriptionTransactionById(
    id
  );
  // console.log(confirmPayment);
  let paidA = parseInt(confirmPayment.paidAmount) + parseInt(body.amount);
  if (confirmPayment.amount == paidA) {
    const confirm = await paymentService.updateconfirmPaymentField(
      id,
      1,
      body.name,
      paidA
    );
    if (confirm[0] > 0) {
      return true;
    }
    return false;
  } else if (parseInt(confirmPayment.amount) < paidA) {
    throw "More than engough";
    // let balance = paidA - parseInt(confirmPayment.amount);
    // let paidLeft = confirmPayment.amount - confirmPayment.paidAmount;
    // if (paidLeft != 0 && paidLeft > 0) {
    //   const confirm = await paymentService.updateconfirmPaymentField(
    //     id,
    //     1,
    //     body.name,
    //     paidLeft
    //   );
    // }
    // // let balanceBody = {};
    // // balanceBody.balance = balance;
    // // balanceBody.CompanyId = confirmPayment.paymentInformationId;

    // // const addBalance = await paymentService.addAmountBalance(balanceBody);
    // // if (addBalance || confirm[0] > 0) {
    // //   return true;
    // // }
    // // return false;
  } else {
    const confirm = await paymentService.updateconfirmPaymentField(
      id,
      0,
      body.name,
      paidA
    );
    // console.log(confirm)
    if (confirm[0] > 0) {
      return true;
    }
    return false;
  }
}
module.exports = {
  addPaymentInformation,
  getUserPaymentInformations,
  buyPlan,
  getSubscription,
  getAllSubscriptionById,
  getAllSubscriptionByCompId,
  getAllSubscription,
  purchaseCV,
  purchaseBySubscriptionId,
  confirmPayment,
  depositMoney,
  getBalance,
  payFromBalance,
  payExemptByCompId
};
