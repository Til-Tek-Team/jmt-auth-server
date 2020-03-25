'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'companies',
      'applicationId')
      .then(() => {
        return queryInterface
          .addColumn("companies", "applicationApplicationId", {
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
    .addColumn("companies", "applicationId")
    .then(() => {
      return queryInterface.removeColumn(
        "companies",
        "applicationApplicationId"
      );
    });
  }
};
