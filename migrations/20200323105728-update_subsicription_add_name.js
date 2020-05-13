'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'subscription_transactions',
      'paidBy',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'subscription_transactions',
      'paidBy'
    )
  }
};
