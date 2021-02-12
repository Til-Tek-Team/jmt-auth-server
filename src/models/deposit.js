/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "deposits",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      deposit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.UUID,
        references: {
          model: "companies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        constraints: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        constraints: false,
      },
      paymentInfoId: {
        type: DataTypes.UUID,
        references: {
          model: "payment_infos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        constraints: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "deposits",
    }
  );
};
