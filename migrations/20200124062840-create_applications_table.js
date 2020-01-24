"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("applications", {
      applicationName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      applicationId: {
        type: Sequelize.STRING,
        defaultValue: false,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("applications");
  }
};
