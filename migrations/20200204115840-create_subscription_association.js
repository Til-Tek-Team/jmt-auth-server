"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("subscriptions", "PaymentId", {
      type: Sequelize.UUID,
      references: {
        model: "payment_informations",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      constraints: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("subscriptions", "PaymentId");
  }
};
