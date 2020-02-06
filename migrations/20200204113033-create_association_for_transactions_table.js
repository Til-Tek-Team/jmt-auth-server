"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("subscription_transactions", "UserId", {
        type: Sequelize.INTEGER,
        references: {
          model: "application_users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        constraints: false
      })
      .then(() => {
        return queryInterface.addColumn(
          "subscription_transactions",
          "PaymentId",
          {
            type: Sequelize.UUID,
            references: {
              model: "payment_informations",
              key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
            constraints: false
          }
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn("subscription_transactions", "UserId")
      .then(() => {
        return queryInterface.removeColumn(
          "subscription_transactions",
          "PaymentId"
        );
      });
  }
};
