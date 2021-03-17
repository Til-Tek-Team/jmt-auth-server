const app = (module.exports = require("express")());

const paymentController = require("../controllers/payment.controller");

// new payment routes
app.post("/create", paymentController.createPaymentInfo);
app.get("/list/:username", paymentController.getUserPaymentInfos);
app.get("/get/:paymentInfoId", paymentController.getPaymentInfo);

app.post("/deposit", paymentController.deposit);
app.post("/transaction", paymentController.addTransactions);
app.post("/buy_video", paymentController.buyVideoTransaction);
app.get("/balance/:username", paymentController.balance);

