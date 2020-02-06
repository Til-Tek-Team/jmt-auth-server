"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("payment_informations", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      creditCardNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      securityCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ownerReference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cvc: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currencyType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "peso"
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
    return queryInterface.dropTable("payment_informations");
  }
};
