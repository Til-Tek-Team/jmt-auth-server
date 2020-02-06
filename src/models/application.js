/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "applications",
    {
      applicationName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      applicationId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "0",
        primaryKey: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: "applications"
    }
  );
};
