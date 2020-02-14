'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'subscription_transactions',
      'paid',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'subscription_transactions',
      'paid'
    )
  }
};
