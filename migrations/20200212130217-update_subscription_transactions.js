'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'subscription_transactions',
      'PaymentId')
      .then(() => {
        return queryInterface
          .addColumn("subscription_transactions", "paymentInformationId", {
            type: Sequelize.UUID,
            references: {
              model: "payment_informations",
              key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
            constraints: false
          })
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "subscription_transactions",
      "paymentInformationId"
    )
      .then(() => {
        return queryInterface
          .addColumn("subscription_transactions", "PaymentId", {

            type: Sequelize.UUID,
            references: {
              model: "payment_informations",
              key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
            constraints: false

          })
      });
  }
};