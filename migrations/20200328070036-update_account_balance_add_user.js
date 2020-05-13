"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("balance_account", "UserId", {
      type: Sequelize.UUID,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      constraints: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("balance_account", "UserId");
  }
};
