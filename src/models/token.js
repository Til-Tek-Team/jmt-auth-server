/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tokens",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      expired: {
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
      }
    },
    {
      tableName: "tokens"
    }
  );
};
