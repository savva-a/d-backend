const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
// const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  // let text;

  if (!session) return API.fail(res, API.errors.USER_NOT_FOUND);
  session = _await(model.UserSession.findOne({ _id: session }).populate({
    model: 'User',
    path: 'user'
  }).exec());
  if (session && session.user) {
    if (session.user.banned) {
      const error = API.errors.ACCESS_DENIED;
      if (error.text.length < 15) {
        error.text += '\nReason: This account was banned';
      }
      return API.fail(res, error);
    }

    return API.success(res, session.user);
  }
  return API.fail(res, API.errors.UNAUTHORIZED);
});
