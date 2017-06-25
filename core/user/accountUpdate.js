const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const API = require('../APILib');
const model = require('../db/model');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  session.user.isSubmitApplicationForRestaurant = true;
  const user = _await(session.user.save());

  const subject = 'Business request';
  const body = `<p>Thank you for join us as Merchant.</p>
                <p>Your business account will be verified in two business days</p>`;

  utils.sendMessageToUser(user.mail, subject, body);

  return API.success(res, {
    isSubmitApplicationForRestaurant: user.isSubmitApplicationForRestaurant
  });
});
