const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  const adminsToRes = [];

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  const admins = _await(model.Admin.find().exec());
  if (!admins) return API.fail(res, API.errors.UNKNOWN);

  admins.forEach((admin) => {
    if (`${admin._id}` !== `${session.admin}`) {
      adminsToRes.push(admin);
    }
  });
  return API.success(res, adminsToRes);
});
