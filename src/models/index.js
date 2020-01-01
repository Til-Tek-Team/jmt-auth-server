const sequelize = require('../database/connection');

const User = sequelize.import("./users.js");

module.exports = {
    User
}