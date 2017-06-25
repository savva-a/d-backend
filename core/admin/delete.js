const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let admin = req.body.admin;
  let admins;
  const adminsToRes = [];

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  admin = _await(model.Admin.findOne({ _id: admin }).exec());
  if (!admin) return API.fail(res, API.errors.USER_NOT_FOUND);

  _await(admin.remove());

  admins = _await(model.Admin.find().exec());
  if (!admins) admins = [];

  admins.forEach((_admin) => {
    if (`${_admin._id}` !== `${session.admin}`) {
      adminsToRes.push(_admin);
    }
  });
  return API.success(res, adminsToRes);
});
