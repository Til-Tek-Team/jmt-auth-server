const { Token } = require("../models");

function createToken(token) {
  return Token.create(token).catch((err) => console.log(err));
}
function createTokenTr(token, transaction) {
  return Token.create(token, { transaction });
}

function getToken(token) {
  return Token.findOne({ where: { token, expired: false } }).catch((err) => console.log(err));
}

function updateToken(token, data) {
  return token.update(data);
}

module.exports = {
  createToken,
  createTokenTr,
  getToken,
  updateToken
};
