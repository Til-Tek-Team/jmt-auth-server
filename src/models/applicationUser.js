/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "application_users",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      role: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      verified: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: "0"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      applicationApplicationId: {
        type: DataTypes.STRING(255),
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
      CompanyId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "companies",
          key: "id"
        }
      },
      PaymentIdentifier: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: "application_users"
    }
  );
};
