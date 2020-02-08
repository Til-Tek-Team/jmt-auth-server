const { validatePaymentInformation } = require("../_helpers/validators");
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
  subTransaction.UserId = UserId;
  subTransaction.PaymentId = PaymentId;
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

  if ( subscription && subscription.type == "EXPRESS") {
    if (subscription.points > 31) {
      const points = parseInt(subscription.points) - parseInt(CVPOINT);
      const updateSubscription = await paymentService.updateSubscriptionById(subscription.id,{points});
      if(updateSubscription){
        return updateSubscription;
      }
   
    }
  } else if ( subscription && subscription.type == "PREMIUM") {
    const today = moment().format();  
    if (subscription.expirationDate >= today) {
      const point = parseInt(subscription.points) - parseInt(CVPOINT);
      const updateSubscription = await paymentService.updateSubscriptionById(subscription.id,{points:point});
      if(updateSubscription){
        return updateSubscription;
      }
    }
  }

}

module.exports = {
  addPaymentInformation,
  getUserPaymentInformations,
  buyPlan,
  getSubscription,
  getAllSubscription,
  purchaseCV,
  purchaseBySubscriptionId
};
