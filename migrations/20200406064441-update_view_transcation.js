'use strict';
const view_name = "view_payment_transcation";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = 'Create view view_payment_transcation as SELECT id as transactionId, balance as credit,debit,updatedAt as transactionDate,CompanyId, "DEPOSIT" as type,(select CONCAT_WS(" ", lastName, firstName) as name from users where id = balance_account.UserId ) as name from final_auth_server.balance_account UNION ALL select id as transactionId, credit, amount as debit ,updatedAt as transactionDate, paymentInformationId as CompanyId,"PURCHASE" as type,transactionMadeBy as name from subscription_transactions order by transactionDate';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};

