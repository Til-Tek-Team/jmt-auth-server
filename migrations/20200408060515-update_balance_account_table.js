'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'balance_account',
      'type',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'DEPOSIT',
      }
    )
  
  },

  down: (queryInterface, Sequelize) => {
    return  queryInterface.removeColumn(
      'balance_account',
      'type',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  }
};
