const validator = require("validator");
const _ = require("lodash");

function validateUser(data) {
  let valid = true;
  const fields = ["email", "phoneNumber", "password", "firstName", "lastName"];
  const keys = _.keys(data);
  fields.map(field => {
    if (keys.includes(field)) {
      return;
    }
    valid = false;
  });
  if (!valid) {
    return valid;
  }
  _.map(data, (value, key) => {
    if (key == "email") {
      if (!validator.isEmail(value + "")) {
        valid = false;
      }
    } else {
      if (validator.isEmpty(value + "")) {
        valid = false;
      }
    }
  });

  return valid;
}

function validatePlanType(planType) {
  let valid = true;
  const fields = ["type", "name", "value", "amount"];
  const keys = _.keys(planType);
  fields.map(field => {
    if (keys.includes(field)) {
      return;
    }
    valid = false;
  });
  if (!valid) {
    return valid;
  }

  _.map(planType, (value, key) => {
    if (key == "value" || key == "amount") {
      if (!validator.isNumeric(value + "")) {
        valid = false;
      }
    } else {
      if (validator.isEmpty(value + "")) {
        valid = false;
      }
    }
  });

  return valid;
}

function validatePaymentInformation(data) {
  let valid = true;
  const fields = [
    "userId",
    "firstName",
    "lastName",
    "creditCardNumber",
    "securityCode",
    "cvc",
    "currencyType"
  ];
  const keys = _.keys(data);
  fields.map(field => {
    if (keys.includes(field)) {
      return;
    }
    valid = false;
  });
  if (!valid) {
    return valid;
  }
  _.map(data, (value, key) => {
    if (key == "cvc") {
      if (
        !validator.isNumeric(value + "") ||
        (value + "").length > 4 ||
        (value + "").length < 3
      ) {
        valid = false;
      }
    } else if (key == "creditCardNumber") {
      if (!validator.isCreditCard(value + "")) {
        valid = false;
      }
    } else {
      if (validator.isEmpty(value + "")) {
        valid = false;
      }
    }
  });

  return valid;
}

module.exports = {
  validateUser,
  validatePaymentInformation,
  validatePlanType
};
