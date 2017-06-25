const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let mail = req.body.mail;
  const password = req.body.password;

  if (!mail || !password) return API.fail(res, API.errors.MISSED_FIELD);
  if (!utils.validateEmail(mail.toLowerCase())) {
    return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);
  }

  mail = mail.toLowerCase();
  let user = _await(model.User.findOne({ mail }).select('+password').exec());
  if (!user) {
    return API.fail(res, API.errors.USER_NOT_FOUND);
  } else if (!user.activeAccount) {
    return API.fail(res, API.errors.ACCESS_DENIED);
  } else if (!user.password) {
    return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
  }

  return user.comparePassword(password, _async((error, isMatch) => {
    if (error) {
      return API.fail(res, API.errors.UNKNOWN);
    }

    if (!isMatch) {
      return API.fail(res, API.errors.USER_PASSWORD_NOT_MATCH);
    }

    let session = new model.UserSession({
      user: user._id
    });

    // if (!user.verification) {
    //   const newVerification = new model.Verification({
    //     user: user._id,
    //     code: utils.generateRandomString(5)
    //   });
    //   newVerification.save();
    //   utils.sendMessage(newVerification.code, mail, true);
    // }

    session = _await(session.save());
    user = _await(user.save());

    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    utils.assign(user, { session: session._id });

    return API.success(res, user);
  }));
});
