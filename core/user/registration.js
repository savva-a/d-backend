const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let mail = req.body.mail;
  const name = req.body.name;
  const password = req.body.password;

  if (!mail || !password || !name) return API.fail(res, API.errors.MISSED_FIELD);
  if (!utils.validateEmail(mail)) return API.fail(res, API.errors.INVALID_EMAIL_ADDRESS);

  mail = mail.toLowerCase();
  const user = _await(model.User.findOne({ mail }).exec());
  if (user) return API.fail(res, API.errors.USER_EXIST);

  let newUser = new model.User({
    mail,
    name,
    password,
    date: Date.now(),
    verification: false
  });

  // let newVerification = new model.Verification({
  //   user: newUser._id,
  //   code: utils.generateRandomString(5)
  // });
  // newVerification = _await(newVerification.save());
  // utils.sendMessage(newVerification.code, mail, true);

  newUser = _await(newUser.save());

  let session = new model.UserSession({
    user: newUser._id
  });
  session = _await(session.save());

  newUser = JSON.parse(JSON.stringify(newUser));
  delete newUser.password;
  utils.assign(newUser, { session: session._id });

  return API.success(res, newUser);
});
