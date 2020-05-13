'use strict';
const view_name = "view_compaines_list_subscription";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const query =
    "Create VIEW view_compaines_list_subscription AS (SELECT cp.id as CompanyId, cp.companyName,cp.address,cp.updatedAt as companyCreatedDate, cp.industryType, sb.id as SubscriptionId,sb.subscriptionDate,sb.updatedAt as subsUpdatedAt, sb.type,sb.expirationDate,sb.premiumType,sb.expressType, (select sum(credit) from view_payment_transcation vwt where vwt.CompanyId = cp.id) as balance , (select sum(debit) from view_payment_transcation vwt where vwt.CompanyId = cp.id) as purchased  FROM companies cp LEFT JOIN subscriptions sb ON cp.id = sb.PaymentId)";
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};


