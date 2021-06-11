const { Deposit } = require("../models");

function addDesposit(body) {
  return Deposit.create(body);
}
function getDeposit() {
  return Deposit.findAll();
}
function getDepositById(id) {
  return Deposit.findOne({ where: { id } });
}
function updateDeposit(Deposit, body) {
  return Deposit.update(body);
}
function updateDepositById(id, body) {
  return Deposit.update(body, { where: { id } });
}

module.exports = {
  addDesposit,
  getDeposit,
  getDepositById,
  updateDeposit,
  updateDepositById
};
