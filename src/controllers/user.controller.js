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
var sequelize = require("sequelize");

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
    .then((user) => user.success ? res.status(200).json({ success: true, user }) : res.status(200).json({ success: false, user }))
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
        : res
            .status(200)
            .json({ success: false, error: "Somethin went wrong " })
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
    .then((changePasswordToken) =>
      res.status(200).json({ success: true, changePasswordToken })
    )
    .catch((err) => next(err));
}

function changePassword(req, res, next) {
  let { password, confirmPassword, id } = req.body;
  if (!password || !confirmPassword || !id) {
    res.status(200).json({ success: false, error: "invalid request" });
    return;
  }

  if (password !== confirmPassword) {
    res
      .status(200)
      .json({ success: false, error: "passwords should be the same" });
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
  let {
    email,
    firstName,
    lastName,
    phoneNumber,
    socialId,
    APPLICATION,
    role,
  } = req.body;

  if (
    !email ||
    phoneNumber == undefined ||
    !socialId ||
    !APPLICATION ||
    !role
  ) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  socialSignupHandler({
    email,
    firstName,
    lastName,
    phoneNumber,
    socialId,
    APPLICATION,
    role,
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
  let { id, oldPassword, newPassword } = req.body;

  if (!id || !oldPassword || !newPassword) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  updatePasswordHandler(id, oldPassword, newPassword)
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

  if (!firstName || !lastName || !phoneNumber || !id) {
    return res.status(200).json({ success: false, error: "invalid request" });
  }

  updateUserHandler({ firstName, lastName, phoneNumber, id })
    .then((user) => res.status(200).json({ success: true, user }))
    .catch((err) => next(err));
}

function addCompanyProfile(req, res, next) {
  let company = req.body;
  // console.log(company, "company")
  let { id, companyName, applicationApplicationId, user_id } = company;
  if (!id || !companyName || !applicationApplicationId || !user_id ) {
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

function getUtcTime() {
  let d = new Date();
  let utcTime = d.getTime() + d.getTimezoneOffset() * 60000;
  let utcDate = moment(new Date(utcTime)).format("YYYY-MM-DD HH:mm:ss");
  return utcDate;
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
  let authUser = await userService.getUserByUserName(user.username);
  let newApplicationUser = await userService.addApplicationUser(
    authUser.id,
    user.application,
    user.role,
    user.verified
  );
  // console.log(newApplicationUser);
  if (newApplicationUser) {
    return newApplicationUser;
  }
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

  let updatedUser = _.omit(user.dataValues, [
    "password",
    "createdAt",
    "updatedAt",
  ]);
  return updatedUser;
}

async function applicationUserHandler({userId, application, role}) {
  // console.log(userId, application, role);
  if (userId && application && role) {
    const applicationUser = await userService.addApplicationUser(userId, application, role);
      if (!applicationUser) {
        throw "something went wrong";
      }
      return applicationUser;
  } else {
    throw "missing field"
  }
}

async function signUpHandler(user) {
  user.username = user.username ? user.username : user.email;
  const checkedUser = await checkUsernameUnique(user.username);
  if (!checkedUser.isUnique) {
    return { ...checkedUser, success: false };
  }

  let createdUser = await userService.createUser(user);
  const token = jwt.sign({ sub: createdUser.id }, CONSTANTS.JWTEMAILSECRET);
  let createToken = await tokenService.createToken({ token });

  if (!createdUser || !createToken) {
    throw "something went wrong";
  }

  if (
    user.APPLICATION == "TRABAHANAP" ||
    user.APPLICATION == "MSP" ||
    user.APPLICATION == "JOBDOR"
  ) {
    const applicationUser = await userService.addApplicationUser(
      createdUser.id,
      user.APPLICATION,
      user.role
    );

    if (!applicationUser) {
      throw "something went wrong";
    }
  }

  let updatedUser = _.omit(createdUser.dataValues, ["password"]);

  return { ...updatedUser, success: true, emailVerificationToken: token };
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
    updatedAt: sequelize.fn("NOW"),
  });
  user.dataValues["emailVerificationToken"] = token;

  return user;
}

async function getUnverifiedUserByDateOnly(startDate, endDate) {
  const users = await userService.getUnverifiedUserByDateOnly(
    startDate,
    endDate
  );

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
    const countUsers = await userService.countUnverifiedUser(
      startDate,
      endDate
    );
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
  const difference = curreTime.diff(tokenCreated, "minutes");
  if (difference > 15) {
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
    emailVerified: true,
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
    applicationName: application.applicationApplicationId,
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
  return {
    id: temp.id,
    username: temp.username,
    email: temp.email,
    role: application.role,
    firstName: temp.firstName,
    lastName: temp.lastName,
    applicationName: application.applicationApplicationId,
    phoneNumber: temp.phoneNumber,
    ...company,
  };
}

async function socialSignupHandler(user) {
  if (!(await isEmailUnique(user.email))) {
    throw "Email is already in use";
  }
  user.username = user.email;
  user.password = uuid4();

  const createdUser = await userService.createUser({ ...user });
  if (!createdUser) {
    return "something went wrong";
  }

  if (user.APPLICATION == "TRABAHANAP") {
    const applicationUser = await userService.addApplicationUser(
      createdUser.id,
      "TRABAHANAP",
      user.role
    );

    if (!applicationUser) {
      throw "something went wrong";
    }
  }

  let updatedUser = _.omit(createdUser.dataValues, ["password"]);

  return updatedUser;
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

async function updatePasswordHandler(id, oldPassword, newPassword) {
  const user = await userService.getUserById(id);
  if (!user) {
    throw "user is not found";
  }

  const pass = bcryptjs.compareSync(oldPassword, user.password);

  if (!pass) {
    throw "password incorrect";
  }

  const updatedUser = await userService.updateUser(user, {
    password: bcryptjs.hashSync(newPassword, 10),
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
      applicationName: application.applicationApplicationId,
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
    password: bcryptjs.hashSync(password, 10),
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
  const appUser = await paymentService.getApplicationUserByUserIdAndApplication(
    company.user_id,
    company.applicationApplicationId
  );
  console.log(appUser, 'appuser')

  if (!appUser) {
    throw "user is not found";
  }

  company.createdAt = new Date();
  company.updatedAt = new Date();

  const paymentInfo = {};
  paymentInfo.firstName = company.companyName;
  paymentInfo.lastName = company.companyName;
  paymentInfo.id = company.id;
  paymentInfo.ownerReference = company.id;
  paymentInfo.creditCardNumber = "5500000000000004";
  paymentInfo.securityCode = 1234;
  paymentInfo.cvc = 1234;
  paymentInfo.currencyType = "peso";
  paymentInfo.createdAt = new Date();
  paymentInfo.updatedAt = new Date();
  const addCompany = await paymentService.addCompany(company);
  const updatedUser = await paymentService.updateApplicationUser(appUser, {
    ...appUser.dataValues,
    CompanyId: company.id,
  });
  const paymentInfoAdd = await paymentService.addPaymentInformation(
    paymentInfo
  );

  if (!updatedUser || !addCompany || !paymentInfoAdd) {
    throw "something went wrong";
  }

  return addCompany;
}

async function checkUsernameHandler(username) {
  let user = await userService.getUserByUserName(username);
  if (user) {
    return false;
  }

  return true;
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
};
