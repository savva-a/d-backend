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
    const body = `<p>Hi ${user.name},</p>
                  <p>Thank you for creating an account. We need further information from you in order for your account to be approved.</p>
                  <p>Please provide us some information based on the three questions below:</p>
                  <ol>
                    <li>Has your restaurant registered with another web service? For example, Google My Business.</li>
                    <li>Is this the new restaurant that has not yet started to operate?</li>
                    <li>Are you able to provide us the website of the restaurant?</li>
                  </ol>
                  <p>Please kindly reply us via email at enquiry@foodpipr.com and We will get you approved as soon as possible.</p>`;

    utils.sendMessageToUser(user.mail, subject, body);

    return API.success(res, { user, products: [] });
  } catch (e) {
    return API.fail(res, API.errors.UNKNOWN);
  }
});
