const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let mail = req.body.mail;
  const verification = req.body.verification;

  if (!utils.validateEmail(mail)) return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);
  mail = mail.toLowerCase();
  const user = _await(model.User.findOne({ mail }).exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);
  API.success(res, { msg: 'ok', mail });

  if (!verification) {
    let passwordRestore = new model.UserPasswordRestore({
      user,
      code: utils.generateRandomString(5)
    });

    passwordRestore = _await(passwordRestore.save());
    return utils.sendMessage(passwordRestore.code, mail);
  }

  let newVerification = new model.Verification({
    user: user._id,
    code: utils.generateRandomString(5)
  });
  newVerification = _await(newVerification.save());
  return utils.sendMessage(newVerification.code, mail, verification);
});
