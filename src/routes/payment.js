const app = (module.exports = require("express")());

const paymentController = require("../controllers/payment.controller");


app.post("/payment_information", paymentController.addPaymentInformation);

app.post("/deposit",paymentController.deposit)
app.post("/transaction",paymentController.addTransactions)


app.post("/buy_plan", paymentController.buyPlan);
app.get(
  "/:userId/payment_information",
  paymentController.getUserPaymentInformations
);

