"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.dropTable("subscription_price_logs");
      await queryInterface.dropTable("payment_plan_types");
      await queryInterface.dropTable("subscriptions");
      await queryInterface.dropTable("subscription_transactions");

      await queryInterface.dropTable("payment_informations");


    } catch (err) {
      console.log(`err`, err)
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable("subscription_transactions", {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4
        },
        transactionFrom: {
          type: Sequelize.STRING,
          allowNull: false
        },
        transactionTo: {
          type: Sequelize.STRING,
          allowNull: false
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false
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
      await queryInterface.createTable("payment_informations", {
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
    } catch (err) {

    }
  }

};
