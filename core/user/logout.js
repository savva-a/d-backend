const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;

  session = _await(model.UserSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  _await(session.remove());

  return API.success(res, { message: 'logged out' });
});
