"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("balance_account", "CompanyId", {
      type: Sequelize.UUID,
      references: {
        model: "companies",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      constraints: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("balance_account", "CompanyId");
  }
};