const app = (module.exports = require("express")());

const paymentController = require("../controllers/payment.controller");

app.post("/payment_information", paymentController.addPaymentInformation);

app.post("/deposit",paymentController.deposit)
app.post("/transaction",paymentController.addTransactions)
app.get("/balance/:username",paymentController.balance)


app.post("/buy_plan", paymentController.buyPlan);
app.get("/:userId/payment_information", paymentController.getUserPaymentInformations);

// new payment routes
app.post("/create", paymentController.createPaymentInfo);
app.get("/list/:username", paymentController.getUserPaymentInfos);
app.get("/get/:paymentInfoId", paymentController.getPaymentInfo);
