'use strict';
const view_name = "view_balance";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = 'create view view_balance as select `view_credit_debit`.`companyId` AS `companyId`,(sum(`view_credit_debit`.`credit`) - sum(`view_credit_debit`.`debit`)) AS `balance` from `view_credit_debit` group by `view_credit_debit`.`companyId`';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
