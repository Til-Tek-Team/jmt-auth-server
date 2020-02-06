/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "subscriptions",
    {
      id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      points: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      premiumType: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      expressExpress: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      expirationDate: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      subscriptionDate: {
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
      OwnerReference: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
          model: "payment_informations",
          key: "id"
        }
      }
    },
    {
      tableName: "subscriptions"
    }
  );
};
