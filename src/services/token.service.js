const { Token } = require("../models");

function createToken(token) {
  return Token.create(token).catch((err) => console.log(err));
}

function getToken(token) {
  return Token.findOne({ where: { token, expired: false } }).catch((err) =>
    console.log(err)
  );
}

function updateToken(token, data) {
  return token.update(data);
}

module.exports = {
  createToken,
  getToken,
  updateToken,
};
