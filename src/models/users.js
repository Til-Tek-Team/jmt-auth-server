/* jshint indent: 2 */
const bcryptjs = require("bcryptjs");

module.exports = function (sequelize, DataTypes) {
  let user = sequelize.define(
    "users",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastLoggedIn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailVerified: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: "0",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      socialId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "users",
    }
  );
  user.beforeCreate((u, options) => {
    u.password = bcryptjs.hashSync(u.password, 10);
    return user;
  });

  return user;
};
