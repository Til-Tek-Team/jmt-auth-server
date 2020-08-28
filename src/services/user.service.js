const { User, ApplicationUser, Company } = require("../models");

function createUser(user) {
  // console.log(user, "user created-------------------");
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

function getApplicationUserById(id) {
  return ApplicationUser.findOne({ where: { id } }).catch((err) =>
    console.log(err)
  );
}
function getApplicationUserByUserId(id) {
  return ApplicationUser.findOne({
    where: { userId: id },
    include: { model: Company },
  }).catch((err) => console.log(err));
}

function updateUser(user, data) {
  user.changed("updatedAt", true);
  return user.update(data).catch((err) => console.log(err));
}

function addApplicationUser(
  UserId,
  applicationApplicationId,
  role,
  verified = "0"
) {
  // console.log(UserId, applicationApplicationId, role);
  return ApplicationUser.create({
    UserId,
    applicationApplicationId,
    role,
    verified,
  }).catch((err) => console.log(err));
}

function updateApplicationUser(UserId) {
  return sequelize
    .query(
      `UPDATE application_users SET verified = true WHERE UserId = '${UserId}'`
    )
    .catch((err) => console.log(err));
}

function getUnverifiedUserByDate(startDate, endDate, offset, limit) {
  console.log(startDate, endDate, offset, limit, "sdfsd");
  return sequelize
    .query(
      `SELECT u.* FROM users u left join application_users au on u.id = au.UserId WHERE u.emailVerified=0 and u.socialId <=> NULL and (u.createdAt between '${startDate}' and '${endDate}') and applicationApplicationId='TRABAHANAP' order by u.createdAt DESC limit ${offset} ,${limit}`,
      { type: sequelize.QueryTypes.SELECT }
    )
    .catch((err) => console.log(err));
}

function countUnverifiedUser(startDate, endDate) {
  return sequelize
    .query(
      `SELECT count(*) FROM users u left join application_users au on u.id = au.UserId WHERE u.emailVerified=0 and u.socialId <=> NULL and (u.createdAt between '${startDate}' and '${endDate}') and applicationApplicationId='TRABAHANAP'`,
      { type: sequelize.QueryTypes.SELECT }
    )
    .catch((err) => console.log(err));
}

function getUnverifiedUserByDateOnly(startDate, endDate) {
  // console.log(startDate,endDate,offset,limit,'sdfsd')
  return sequelize
    .query(
      `SELECT u.* FROM users u left join application_users au on u.id = au.UserId WHERE u.emailVerified=0 and u.socialId <=> NULL and (u.createdAt between '${startDate}' and '${endDate}') and applicationApplicationId='TRABAHANAP'`,
      { type: sequelize.QueryTypes.SELECT }
    )
    .catch((err) => console.log(err));
}
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  addApplicationUser,
  updateApplicationUser,
  getApplicationUserById,
  getApplicationUserByUserId,
  getUserByUserName,
  getUnverifiedUserByDate,
  getUnverifiedUserByDateOnly,
  countUnverifiedUser,
};
