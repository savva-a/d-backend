const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  const mail = req.body.mail;
  const code = req.body.code;
  let user;
  let isMatch = false;
  let text;

  user = _await(model.User.findOne({ mail }).populate('location').exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

  const verifications = _await(model.Verification.find({ user: user._id }).exec());
  if (!verifications || !verifications.length) return API.fail(res, API.errors.NOT_FOUND);

  verifications.forEach((verification) => {
    if (`${verification.code}` === `${code}`) {
      isMatch = true;
      user.verification = true;
    }
  });

  if (!isMatch) {
    return API.fail(res, API.errors.USER_CODE_NOT_MATCH);
  }
  if (user.location) {
    text = user.location.text;
  }
  user.firstTime = utils.isUserFirstTime(user.mail, user.name, user.phone, text);

  user = _await(user.save());
  let session = new model.UserSession({
    user: user._id
  });

  session = _await(session.save());

  user = JSON.parse(JSON.stringify(user));
  utils.assign(user, { session: session._id });

  API.success(res, user);

  return verifications.forEach((verification) => {
    _await(verification.remove());
  });
});
