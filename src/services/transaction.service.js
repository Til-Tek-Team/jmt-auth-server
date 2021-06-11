const { Transaction } = require("../models");

function addTransaction(body) {
  return Transaction.create(body);
}
function getTransactions() {
  return Transaction.findAll();
}
function getTransactionById(id) {
  return Transaction.findOne({ where: { id } });
}
function updateTransaction(Transaction, body) {
  return Transaction.update(body);
}
function updateTransactionById(id, body) {
  return Transaction.update(body, { where: { id } });
}

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  updateTransactionById
};
