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
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ApplicationId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "applications",
          key: "applicationId"
        }
      },
      UserId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        }
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
