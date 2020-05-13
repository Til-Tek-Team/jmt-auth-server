'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'balance_account',
      'debit',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    )
  
  },

  down: (queryInterface, Sequelize) => {
    return  queryInterface.removeColumn(
      'balance_account',
      'debit',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  }
};
