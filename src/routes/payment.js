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
