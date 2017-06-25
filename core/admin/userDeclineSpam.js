const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;

  try {
    session = _await(model.AdminSession.findOne({ _id: session }).exec());
    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

    user = _await(model.User.findOne({ _id: user }).exec());
    if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

    user.isSubmitApplicationForRestaurant = false;

    user = _await(user.save());

    const subject = 'Account wasn\'t  switched to merchant';
    const body = '<p> Your account wasn\'t switched to merchant</p>';

    utils.sendMessageToUser(user.mail, subject, body);

    return API.success(res, { user, products: [] });
  } catch (e) {
    return API.fail(res, API.errors.UNKNOWN);
  }
});
