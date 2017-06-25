const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;

  if (session) {
    session = _await(model.UserSession.findOne({ _id: session }).populate({
      model: 'User',
      path: 'user'
    }).exec());
    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);
    user = session.user;
  } else {
    user = _await(model.User.findOne({ _id: user }).exec());
    if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);
  }

  return API.success(res, user);
});
