const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let mail = req.body.mail;
  const code = req.body.code;
  const password = req.body.password;
  let user;
  let isMatch = false;

  mail = mail.toLowerCase();
  user = _await(model.User.findOne({ mail }).select('+password').exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

  const passwordRestores = _await(model.UserPasswordRestore.find({ user: user._id }).exec());
  if (!passwordRestores || !passwordRestores.length) return API.fail(res, API.errors.NOT_FOUND);

  passwordRestores.forEach((passwordRestore) => {
    if (`${passwordRestore.code}` === `${code}`) {
      isMatch = true;
      user.password = password;
    }
  });

  if (!isMatch) {
    return API.fail(res, API.errors.USER_CODE_NOT_MATCH);
  }

  let session = new model.UserSession({
    user: user._id
  });
  session = _await(session.save());
  // user.firstTime = utils.isUserFirstTime(user.mail, user.name, user.phone, text);
  // if (!user.verification) {
  //   const newVerification = new model.Verification({
  //     user: user._id,
  //     code: utils.generateRandomString(5)
  //   });
  //   newVerification.save();
  //   utils.sendMessage(newVerification.code, mail, true);
  // }
  user = _await(user.save());

  user = JSON.parse(JSON.stringify(user));
  utils.assign(user, { session: session._id });

  API.success(res, user);

  return passwordRestores.forEach((passwordRestore) => {
    _await(passwordRestore.remove());
  });
});
