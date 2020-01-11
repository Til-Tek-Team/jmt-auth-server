const sequelize = require('../database/connection');

const User = sequelize.import("./users.js");
const Token = sequelize.import("./token.js");

module.exports = {
    User,
    Token
}