/* jshint indent: 2 */
const bcryptjs = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  let application = sequelize.define(
    "application_users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
      tableName: "application_users"
    }
  );

  return application;
};
