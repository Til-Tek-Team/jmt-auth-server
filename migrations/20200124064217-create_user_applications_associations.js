"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("application_users", "ApplicationId", {
        type: Sequelize.STRING,
        references: {
          model: "applications",
          key: "applicationId"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        constraints: false
      })
      .then(() => {
        return queryInterface.addColumn("application_users", "UserId", {
          type: Sequelize.UUID,
          references: {
            model: "users",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          constraints: false
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn("application_users", "ApplicationId")
      .then(() => {
        return queryInterface.removeColumn("application_users", "UserId");
      });
  }
};
