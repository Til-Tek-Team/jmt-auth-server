const { User, ApplicationUser } = require("../models");

function createUser(user) {
  console.log(user, "user created-------------------");
  return User.create(user).catch((err) => console.log(err));
}

function getUserByEmail(email) {
  return User.findOne({ where: { email } }).catch((err) => console.log(err));
}

function getUserByUserName(username) {
  return User.findOne({ where: { username } }).catch((err) => console.log(err));
}

function getUserById(id) {
  return User.findOne({ where: { id } }).catch((err) => console.log(err));
}

function updateUser(user, data) {
  return user.update(data);
}

function addApplicationUser(UserId, applicationApplicationId, role) {
  return ApplicationUser.create({
    UserId,
    applicationApplicationId,
    role,
  }).catch((err) => console.log(err));
}

function updateApplicationUser(UserId) {
  return sequelize
    .query(
      `UPDATE application_users SET verified = true WHERE UserId = '${UserId}'`
    )
    .catch((err) => console.log(err));
}

function getUserByUsername(username) {
  return User.findOne({ where: { username } }).catch((err) => console.log(err));
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  addApplicationUser,
  updateApplicationUser,
  getUserByUsername,
  getUserByUserName,
};
