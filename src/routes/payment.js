const app = (module.exports = require("express")());

const PaymentController = require("../controllers/payment.controller");

app.post("/payment_information", PaymentController.addPaymentInformation);
app.get(
  "/:userId/payment_information",
  PaymentController.getUserPaymentInformations
);
