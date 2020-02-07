/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "payment_informations",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      creditCardNumber: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      securityCode: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      ownerReference: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      cvc: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      currencyType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "peso"
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
      tableName: "payment_informations"
    }
  );
};
