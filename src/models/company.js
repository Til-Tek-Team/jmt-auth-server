/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "companies",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
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
      applicationApplicationId: {
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
