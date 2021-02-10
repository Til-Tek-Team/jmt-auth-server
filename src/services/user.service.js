const { User, ApplicationUser, Company } = require("../models");

function createUser(user) {
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

function addApplicationUser(UserId, applicationApplicationId, role, CompanyId = null) {
  return ApplicationUser.create({
    UserId,
    applicationApplicationId,
    role,
    CompanyId,
  }).catch((err) => console.log(err));
}

function updateApplicationUser(UserId) {
  return sequelize
    .query(`UPDATE application_users SET verified = true WHERE UserId = '${UserId}'`)
    .catch((err) => console.log(err));
}

function getUserByUsername(username) {
  return User.findOne({ where: { username } }).catch((err) => console.log(err));
}

function addCompany(company) {
  return Company.create(company).catch((err) => console.log(err));
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
  addCompany,
};
