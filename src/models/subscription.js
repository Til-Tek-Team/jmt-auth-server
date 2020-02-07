/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "subscriptions",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
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
      expressType: {
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
      PaymentId: {
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
