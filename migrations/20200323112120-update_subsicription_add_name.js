'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'subscription_transactions',
      'paidAmount',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'subscription_transactions',
      'paidAmount'
    )
  }
};