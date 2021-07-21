"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("users", "takeOverExpDate", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      })
      .then(() => {
        return queryInterface.addColumn("users", "takeOverAdminName", {
          type: Sequelize.STRING,
          allowNull: true
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "takeOverExpDate").then(() => {
      return queryInterface.removeColumn("users", "takeOverAdminName");
    });
  }
};
