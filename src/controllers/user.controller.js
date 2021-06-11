const userService = require("../services/user.service");
const tokenService = require("../services/token.service");
const paymentService = require("../services/payment.service");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CONSTANTS = require("../../constants.js");
const { validateUser } = require("../_helpers/validators");
const _ = require("lodash");
const uuid4 = require("uuid/v4");
var moment = require("moment");
var Sequelize = require("sequelize");

function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  loginHandler(email, password)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function signUp(req, res, next) {
  const user = req.body;
  const valid = validateUser(user);

  if (!valid) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  signUpHandler(user)
    .then((user) =>
      user.success
        ? res.status(200).json({ success: true, user })
        : res.status(200).json({ success: false, user })
    )
    .catch((err) => next(err));
}

function createApplicationUser(req, res, next) {
  const user = req.body;

  applicationUserHandler(user)
    .then((user) =>
      user.success
        ? res.status(200).json({ success: true, user })
        : res.status(200).json({ success: false, user })
    )
    .catch((err) => next(err));
}

function verifyToken(req, res, next) {
  const token = req.body.token;
  if (!token) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  verifyTokenHandler(token)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function resendEmail(req, res, next) {
  const email = req.body.email;
  if (!email) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  resendEmailHandler(email)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function getUnverifiedUser(req, res, next) {
  getUnverifiedUserByDate(
    req.query.startDate,
    req.query.endDate,
    req.query.offset || 0,
    req.query.limit || 8
  )
    .then((user) =>
      user
        ? res.status(200).json({ success: true, user })
        : res.status(200).json({ success: false, error: "Somethin went wrong" })
    )
    .catch((err) => next("Internal Server Error! Try again"));
}

function getUnverifiedUserDate(req, res, next) {
  getUnverifiedUserByDateOnly(req.query.startDate, req.query.endDate)
    .then((user) =>
      user
        ? res.status(200).json({ success: true, user })
        : res.status(200).json({ success: false, error: "Somethin went wrong " })
    )
    .catch((err) => next("Internal Server Error! Try again"));
}
function verifyEmail(req, res, next) {
  const token = req.body.token;
  if (!token) {
  }

  verifyEmailHandler(token)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function changePasswordRequest(req, res, next) {
  const userId = req.body.userId;
  if (!userId) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  changePasswordRequestHundler(userId)
    .then((changePasswordToken) => res.status(200).json({ success: true, changePasswordToken }))
    .catch((err) => next(err));
}

function changePassword(req, res, next) {
  let { password, confirmPassword, id } = req.body;
  if (!password || !confirmPassword || !id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(200).json({ success: false, error: "passwords should be the same" });
    return;
  }

  changePasswordHandler(id, password)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => next(err));
}

function getUser(req, res, next) {
  let email = req.params.email;
  if (!email) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  getUserHandler(email)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function getUserByUsername(req, res, next) {
  const username = req.params.username;
  if (!username) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  getByUsernameHandler(username)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function socialSignup(req, res, next) {
  let { email, firstName, lastName, phoneNumber, socialId, APPLICATION, role } = req.body;

  if (!email || phoneNumber == undefined || !socialId || !APPLICATION || !role) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  socialSignupHandler({
    email,
    firstName,
    lastName,
    phoneNumber,
    socialId,
    APPLICATION,
    role
  })
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function socialLogin(req, res, next) {
  let { email } = req.body;
  if (!email) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  socialLoginHandler(req.body)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function updatePassword(req, res, next) {
  let { id, oldPassword, newPassword, username } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  updatePasswordHandler(id, oldPassword, newPassword, username)
    .then((success) => res.status(200).json({ success }))
    .catch((err) => next(err));
}

function getUserByEmail(req, res, next) {
  let email = req.params.email;
  if (!email) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  getUserByEmailHandler(email)
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function setPassword(req, res, next) {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  setPasswordHandler(email, password)
    .then((success) => res.status(200).json({ success }))
    .catch((err) => next(err));
}

function updateUser(req, res, next) {
  let { firstName, lastName, phoneNumber, id } = req.body;

  if ((!firstName && !lastName && !phoneNumber) || !id) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  updateUserHandler({ firstName, lastName, phoneNumber, id })
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function addCompanyProfile(req, res, next) {
  let company = req.body;
  // console.log(req.body);
  let { companyName, applicationApplicationId, user_id } = company;
  if (!companyName || !applicationApplicationId || !user_id) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  addCompanyProfileHandler(company)
    .then((company) => res.status(200).json({ success: true, company }))
    .catch((err) => next(err));
}

function checkUsername(req, res, next) {
  if (!req.body.username) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  checkUsernameHandler(req.body.username)
    .then((unique) => res.status(200).json({ success: true, unique }))
    .catch((err) => next(err));
}

function createNewApplicationUser(req, res, next) {
  let { username, application, role, verified } = req.body;
  if (!(username && application && role && verified)) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  createNewApplicationUserHandler(req.body)
    .then((unique) => res.status(200).json({ success: true, unique }))
    .catch((err) => next(err));
}

async function createNewApplicationUserHandler(user) {
  // console.log(user);
  let u = await userService.getUserByUserName(user.username);
  let appUser = await userService.getApplicationUserByUserId(u.id);
  // console.log(appUser.dataValues);
  let newApplicationUser = await userService.addApplicationUser(
    u.id,
    user.application,
    user.role,
    user.verified,
    appUser.CompanyId
  );
  // console.log(newApplicationUser);
  if (newApplicationUser) {
    return newApplicationUser;
  }
}

function deleteUserByUserName(req, res, next) {
  deleteUserByUserNameHandler(req.params.username)
    .then((success) => res.status(200).json({ success, username: req.params.username }))
    .catch((err) => next(err));
}

async function loginHandler(email, password) {
  let user = await userService.getUserByUserName(email);
  if (!user) {
    throw "Email or Password incorrect";
  }
  let userCreated = moment(user.updatedAt);
  let curreTime = moment(Date.now());

  const difference = curreTime.diff(userCreated, "minutes");
  if (!user.emailVerified && parseInt(difference) > 15) {
    throw "Check your confirmation email first";
  }

  if (!user.emailVerified) {
    throw "Verify your email to proceed";
  }

  const pass = bcryptjs.compareSync(password, user.password);

  if (!pass) {
    throw "email or password incorrect";
  }

  let updatedUser = _.omit(user.dataValues, ["password", "createdAt", "updatedAt"]);
  return updatedUser;
}

async function applicationUserHandler({ userId, application, role }) {
  // console.log(userId, application, role);
  if (userId && application && role) {
    const applicationUser = await userService.addApplicationUser(userId, application, role);
    if (!applicationUser) {
      throw "something went wrong";
    }
    return applicationUser;
  } else {
    throw "missing field";
  }
}

async function signUpHandler(user) {
  user.username = user.username ? user.username : user.email;
  const checkedUser = await checkUsernameUnique(user.username);
  if (!checkedUser.isUnique) {
    return { ...checkedUser, success: false };
  }
  console.log(user);
  if (!["MSP", "TALGUU", "JOBDOR"].includes(user.APPLICATION)) {
    throw "Invalid application name";
  }
  const t = await sequelize.transaction();
  try {
    let createdUser = await userService.createUserTr(user, t);
    const token = jwt.sign({ sub: createdUser.id }, CONSTANTS.JWTEMAILSECRET);
    await tokenService.createTokenTr({ token }, t);
    await userService.addApplicationUserTr(
      {
        UserId: createdUser.id,
        applicationApplicationId: user.APPLICATION,
        role: user.role
      },
      t
    );
    let updatedUser = _.omit(createdUser.dataValues, ["password"]);
    await t.commit();
    return { ...updatedUser, success: true, emailVerificationToken: token };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function verifyTokenHandler(token) {
  try {
    var decoded = jwt.verify(token, CONSTANTS.JWTSECRET);
  } catch {
    throw "invalid token";
  }

  return decoded;
}

async function resendEmailHandler(email) {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw "user does not exist";
  }

  const token = jwt.sign({ sub: user.id }, CONSTANTS.JWTEMAILSECRET);
  let createToken = tokenService.createToken({ token });

  if (!createToken) {
    throw "something went wrong";
  }
  const updateUser = await userService.updateUser(user, {
    updatedAt: Sequelize.fn("NOW")
  });
  user.dataValues["emailVerificationToken"] = token;

  return user;
}

async function getUnverifiedUserByDateOnly(startDate, endDate) {
  const users = await userService.getUnverifiedUserByDateOnly(startDate, endDate);

  let user = users.map((items) => {
    const token = jwt.sign({ sub: items.id }, CONSTANTS.JWTEMAILSECRET);
    let createToken = tokenService.createToken({ token });
    items["emailVerificationToken"] = token;
    return items;
  });

  if (user) {
    return user;
  }
}

async function getUnverifiedUserByDate(startDate, endDate, offset, limit) {
  const users = await userService.getUnverifiedUserByDate(
    startDate,
    endDate,
    parseInt(offset) || 0,
    parseInt(limit) || 8
  );
  if (users) {
    const countUsers = await userService.countUnverifiedUser(startDate, endDate);
    let total = Object.values(countUsers[0])[0];
    return { users, total };
  }
}
async function verifyEmailHandler(token) {
  let retriveToken = await tokenService.getToken(token);

  if (!retriveToken) {
    throw "invalid token";
  }

  let tokenCreated = moment(retriveToken.createdAt);
  let curreTime = moment(Date.now());
  const difference = curreTime.diff(tokenCreated, "hours");
  if (difference > 12) {
    throw "invalid token";
  }
  var decoded = jwt.verify(token, CONSTANTS.JWTEMAILSECRET);

  let userId = decoded.sub;

  let user = await userService.getUserById(userId);
  if (!user) {
    throw "something went wrong";
  }

  let updatedUser = await userService.updateUser(user, { emailVerified: true });
  let updateApplicationUser = await userService.updateApplicationUser(userId);

  if (!updatedUser || !updateApplicationUser) {
    throw "something went wrong";
  }

  updatedUser = _.omit(updatedUser.dataValues, ["password"]);

  return updatedUser;
}

async function changePasswordRequestHundler(userId) {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw "user does not exist";
  }

  if (!user.emailVerified) {
    throw "verify your email to proceed";
  }

  const token = jwt.sign({ sub: userId }, CONSTANTS.JWTPASSWORDSECRET);

  let createToken = await tokenService.createToken({ token });

  if (!createToken) {
    throw "something went wrong";
  }

  return token;
}

async function changePasswordHandler(userId, password) {
  const user = await userService.getUserById(userId);

  if (!user) {
    throw "user does not exist";
  }

  const updatedUser = await userService.updateUser(user, {
    password: bcryptjs.hashSync(password, 10),
    emailVerified: true
  });

  if (!updatedUser) {
    throw "something went wrong";
  }

  return true;
}

async function getUserHandler(email) {
  let user = await userService.getUserByEmail(email);

  if (!user) {
    throw "user does not exist";
  }
  const application = await userService.getApplicationUserByUserId(user.id);
  let temp = user.dataValues;
  return {
    id: temp.id,
    username: temp.username,
    email: temp.email,
    role: application.role,
    firstName: temp.firstName,
    lastName: temp.lastName,
    applicationName: application.applicationApplicationId
  };
}

async function getByUsernameHandler(username) {
  let user = await userService.getUserByUserName(username);

  if (!user) {
    throw "user does not exist";
  }

  const application = await userService.getApplicationUserByUserId(user.id);
  let company = {};
  if (application.dataValues.company) {
    let c = application.dataValues.company.dataValues;
    company["companyName"] = c.companyName;
    company["address"] = c.address;
    company["industryType"] = c.industryType;
  }
  let temp = user.dataValues;
  const token = jwt.sign({ sub: temp.id }, CONSTANTS.JWTEMAILSECRET);
  const dbToken = await tokenService.createToken({ token });
  // console.log(dbToken);
  return {
    id: temp.id,
    username: temp.username,
    email: temp.email,
    role: application.role,
    firstName: temp.firstName,
    lastName: temp.lastName,
    applicationName: application.applicationApplicationId,
    phoneNumber: temp.phoneNumber,
    emailVerificationToken: token,
    ...company
  };
}

async function socialSignupHandler(user) {
  if (!(await isEmailUnique(user.email))) {
    throw "Email is already in use";
  }
  user.username = user.email;
  user.password = uuid4();
  const t = await sequelize.transaction();
  try {
    const createdUser = await userService.createUserTr({ ...user }, t);
    const applicationUser = await userService.addApplicationUserTr(
      {
        UserId: createdUser.id,
        applicationApplicationId: user.APPLICATION,
        role: user.role
      },
      t
    );

    let updatedUser = _.omit(createdUser.dataValues, ["password"]);

    await t.commit();
    return updatedUser;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function socialLoginHandler({ email }) {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw "user is not found";
  }

  let updatedUser = _.omit(user.dataValues, ["password"]);

  return updatedUser;
}

async function getUserByEmailHandler(email) {
  const user = await userService.getUserByUserName(email);
  if (!user) {
    throw "user is not found";
  }

  return user;
}

async function updatePasswordHandler(id, oldPassword, newPassword, username) {
  let user;
  if (id) user = await userService.getUserById(id);
  else if (username) user = await userService.getUserByUserName(username);
  // console.log(user)
  if (!user) {
    throw "user is not found";
  }

  const pass = bcryptjs.compareSync(oldPassword, user.password);
  if (!pass) {
    throw "password incorrect";
  }

  const updatedUser = await userService.updateUser(user, {
    password: bcryptjs.hashSync(newPassword, 10)
  });
  if (!updatedUser) {
    throw "something went wrong";
  }

  return true;
}

async function isEmailUnique(email) {
  const foundEmail = await userService.getUserByEmail(email);
  if (foundEmail) {
    return false;
  }
  return true;
}

async function checkUsernameUnique(username) {
  const user = await userService.getUserByUserName(username);
  if (user) {
    const application = await userService.getApplicationUserByUserId(user.id);
    let temp = user.dataValues;
    return {
      isUnique: false,
      id: temp.id,
      username: temp.username,
      email: temp.email,
      role: application.role,
      firstName: temp.firstName,
      lastName: temp.lastName,
      applicationName: application.applicationApplicationId
    };
  }

  return { isUnique: true };
}

async function setPasswordHandler(email, password) {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw "user is not found";
  }

  const updatedUser = await userService.updateUser(user, {
    password: bcryptjs.hashSync(password, 10)
  });
  if (!updatedUser) {
    throw "something went wrong";
  }

  return true;
}

async function updateUserHandler(user) {
  const dbUser = await userService.getUserById(user.id);
  if (!dbUser) {
    throw "user not found";
  }
  const updatedUser = await userService.updateUser(dbUser, user);

  if (!updatedUser) {
    throw "something went wrong";
  }

  return updatedUser;
}

async function addCompanyProfileHandler(company) {
  company.id = uuid4();
  const appUser = await paymentService.getApplicationUserByUserIdAndApplication(
    company.user_id,
    company.applicationApplicationId
  );

  if (!appUser) {
    throw "user is not found";
  }
  const t = await sequelize.transaction();
  try {
    const addCompany = await paymentService.addCompanyTr(company, t);
    const updatedUser = await paymentService.updateApplicationUserTr(
      appUser,
      {
        ...appUser.dataValues,
        CompanyId: company.id
      },
      t
    );
    await t.commit();
    return addCompany;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

async function checkUsernameHandler(username) {
  let user = await userService.getUserByUserName(username);
  if (user) {
    return false;
  }

  return true;
}

function deleteUser(req, res, next) {
  const id = req.params.id;
  if (!id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }
  deleteUserHandler(id)
    .then((user) =>
      user
        ? res.status(200).json({ success: true, user })
        : res.status(400).json({ success: false })
    )
    .catch((err) => next(err));
}

async function deleteUserHandler(id) {
  const user = await userService.getUserById(id);
  if (user) {
    const deleteAppUser = await userService.deleteApplicationUserById(id);
    const deleteUser = await userService.deleteUserById(id);
    if (deleteAppUser || deleteUser) {
      return user;
    }
  }
}
async function deleteUserByUserNameHandler(username) {
  let user = await userService.getUserByUserName(username);
  if (!user) return false;

  let deleted = await userService.updateUserToDeleted(user);
  if (deleted) return true;

  return false;
}

module.exports = {
  login,
  signUp,
  verifyToken,
  verifyEmail,
  changePasswordRequest,
  changePassword,
  getUser,
  getUserByUsername,
  resendEmail,
  createApplicationUser,
  socialSignup,
  socialLogin,
  updatePassword,
  getUserByEmail,
  setPassword,
  updateUser,
  addCompanyProfile,
  checkUsername,
  getUnverifiedUser,
  getUnverifiedUserDate,
  createNewApplicationUser,
  deleteUser,
  deleteUserByUserName
};
