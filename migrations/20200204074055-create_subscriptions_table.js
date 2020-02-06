"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("subscriptions", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      premiumType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expressExpress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expirationDate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      subscriptionDate: {
        type: Sequelize.STRING,
        allowNull: true
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
    return queryInterface.dropTable("subscriptions");
  }
};
