/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "payment_plan_types",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      valueInPoints: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      valueInDays: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
      }
    },
    {
      tableName: "payment_plan_types"
    }
  );
};
