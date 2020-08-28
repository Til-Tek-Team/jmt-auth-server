'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'companies',
      'address',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  
  },

  down: (queryInterface, Sequelize) => {
    return  queryInterface.changeColumn(
      'companies',
      'address',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
  }
};
