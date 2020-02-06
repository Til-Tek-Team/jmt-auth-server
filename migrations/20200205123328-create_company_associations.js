"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("companies", "ApplicationId", {
      type: Sequelize.STRING,
      references: {
        model: "applications",
        key: "applicationId"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      constraints: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("companies", "ApplicationId");
  }
};
