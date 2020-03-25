'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'application_users',
      'ApplicationId')
      .then(() => {
        return queryInterface
          .addColumn("application_users", "applicationApplicationId", {
            type: Sequelize.STRING,
            references: {
              model: "applications",
              key: "applicationId"
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
            constraints: false
          })
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
    .addColumn("application_users", "applicationId")
    .then(() => {
      return queryInterface.removeColumn(
        "application_users",
        "applicationApplicationId"
      );
    });
  }
};
