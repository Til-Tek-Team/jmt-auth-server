/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "subscription_transactions",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      transactionFrom: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      transactionTo: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      applicationUserId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: "application_users",
          key: "id"
        }
      },
      paymentInformationId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "payment_informations",
          key: "id"
        }
      }
    },
    {
      tableName: "subscription_transactions"
    }
  );
};
