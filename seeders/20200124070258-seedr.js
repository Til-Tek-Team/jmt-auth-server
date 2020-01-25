"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let applications = [
      {
        applicationName: "MSP",
        applicationId: "MSP",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        applicationName: "Trabahanap",
        applicationId: "TRABAHANAP",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        applicationName: "TALGUU",
        applicationId: "TALGUU",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert("applications", applications, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("applications", null, {});
  }
};
