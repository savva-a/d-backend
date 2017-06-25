const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const utils = require('../utils');
const model = require('../db/model');
const API = require('../APILib');
// const path = require('../path');
// const userDeleteDialog = require('../utils').userDeleteDialog;

module.exports = _async((req, res) => {
  let session = req.body.session;
  // let products;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  session.user.activeAccount = false;
  _await(session.user.save());

  const subject = 'Account was deactivated';
  const body = `<p>Thank you for using Foodpipr.</p>
                <p> Your account was deactivated</p>`;

  utils.sendMessageToUser(session.user.mail, subject, body);

  return API.success(res, 'Account was deactivated');
});
