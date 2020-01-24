/* jshint indent: 2 */
const bcryptjs = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  let application = sequelize.define(
    "applications",
    {
      applicationName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      applicationId: {
        type: DataTypes.STRING,
        defaultValue: false,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      tableName: "applications"
    }
  );

  return application;
};
