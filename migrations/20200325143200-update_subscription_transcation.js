'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'subscription_transactions',
      'credit',{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    ).then(()=>{
      return queryInterface.removeColumn(
        'subscription_transactions',
        'paidAmount'
      )
    })
  
  },

  down: (queryInterface, Sequelize) => {
    return  queryInterface.addColumn(
      'subscription_transactions',
      'paidBy'
    )
  }
};
