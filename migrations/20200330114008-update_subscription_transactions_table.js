"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "subscription_transactions",
      "transactionMadeBy",
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "subscription_transactions",
      "transactionMadeBy"
    );
  }
};
