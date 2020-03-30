const app = (module.exports = require("express")());

const paymentController = require("../controllers/payment.controller");

app.get("/subscription/:ApplicationId", paymentController.getAllSubscription);
app.get(
  "/subscription/:ApplicationId/:UserId",
  paymentController.getSubscription
);
app.post("/payment_information", paymentController.addPaymentInformation);
app.post("/buy_plan", paymentController.buyPlan);
app.get(
  "/:userId/payment_information",
  paymentController.getUserPaymentInformations
);
app.post(
  "/purchase/cv/:subscriptionId",
  paymentController.purchaseBySubscriptionId
);
app.get(
  "/subscription_transaction/:id",
  paymentController.getAllSubscriptionById
);
app.put("/subscription_transaction/:id", paymentController.confirmPayment);
app.get("/company/subscription_transaction/:compId", paymentController.getAllSubscriptionByCompId);
app.post('/deposit',paymentController.depositMoney);
app.get("/balance/:id", paymentController.getBalance);
app.put("/pay/exempt/:id", paymentController.payExemptByCompId);
app.get(
  "/company/subscription_transaction/:compId",
  paymentController.getAllSubscriptionByCompId
);

app.get("/payment_plan_types", paymentController.getPaymentPlanTypes);
app.get("/payment_plan_types/:id", paymentController.getPaymentPlanType);
app.post("/payment_plan_types", paymentController.createPaymentPlanType);
app.put("/payment_plan_types", paymentController.updatePaymentPlanType);
