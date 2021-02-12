"use strict";
const view_name = "view_credit_debit";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const query =
      'create view view_credit_debit as select deposits.id AS `transactionId`, deposits.createdAt AS `transactionDate`, deposits.deposit AS `credit`, 0 AS debit, `deposits`.`paymentInfoId` AS `paymentInfoId`, `deposits`.`companyId` AS `companyId`, "CREDIT" AS `type` from deposits union all select transactions.id AS `transactionId`, transactions.createdAt AS `transactionDate`,`transactions`.`amount` AS `credit`,0 AS `debit`,transactions.paymentInfoId AS `paymentInfoId`, transactions.companyId as companyId, "DEBIT" AS `type` from `transactions`';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  },
};
