"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "deleted", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "deleted");
  },
};
