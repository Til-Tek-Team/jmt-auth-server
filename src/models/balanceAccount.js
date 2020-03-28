/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "balance_account",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      balance: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "0"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      CompanyId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "companies",
          key: "id"
        }
      }
    },
    {
      tableName: "balance_account"
    }
  );
};
