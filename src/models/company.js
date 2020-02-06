/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "companies",
    {
      id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      companyName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      industryType: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      ApplicationId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
          model: "applications",
          key: "applicationId"
        }
      }
    },
    {
      tableName: "companies"
    }
  );
};
