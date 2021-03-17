"use strict";
const view_name = "view_payment_transcation";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {

      await queryInterface.dropTable("balance_account");
      await queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
      await queryInterface.sequelize.query(`DROP VIEW view_compaines_list_subscription`);


    } catch (err) {

    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable("balance_account", {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4
        },
        balance: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
      let query = 'Create view view_payment_transcation as SELECT id as transactionId, balance as credit,debit,updatedAt as transactionDate,CompanyId, "DEPOSIT" as type from final_auth_server.balance_account UNION ALL select id as transactionId, credit, amount as debit ,updatedAt as transactionDate, paymentInformationId as CompanyId,"PURCHASE" as type from subscription_transactions order by transactionDate';
      await queryInterface.sequelize.query(query);
      query =
        "Create VIEW view_compaines_list_subscription AS (SELECT cp.id as CompanyId, cp.companyName,cp.address,cp.updatedAt as companyCreatedDate, cp.industryType, sb.id as SubscriptionId,sb.subscriptionDate,sb.updatedAt as subsUpdatedAt, sb.type,sb.expirationDate,sb.premiumType,sb.expressType, (select sum(credit) from view_payment_transcation vwt where vwt.CompanyId = cp.id) as balance , (select sum(debit) from view_payment_transcation vwt where vwt.CompanyId = cp.id) as purchased  FROM companies cp LEFT JOIN subscriptions sb ON cp.id = sb.PaymentId)";
      await queryInterface.sequelize.query(query);
    } catch (err) {

    }
  }

};
