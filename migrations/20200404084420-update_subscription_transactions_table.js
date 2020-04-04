"use strict";

"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "subscription_transactions",
      "transaction_type",
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "PURCHASED",
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "subscription_transactions",
      "transaction_type"
    );
  },
};
