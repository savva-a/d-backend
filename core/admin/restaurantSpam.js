const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  let session = req.body.session;
  let restaurant = req.body.restaurant;

  try {
    session = _await(model.AdminSession.findOne({ _id: session }).exec());
    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

    restaurant = _await(model.Restaurant.findOne({ _id: restaurant }).exec());
    if (!restaurant) return API.fail(res, API.errors.NOT_FOUND);

    restaurant.alreadyVerified = true;

    restaurant = _await(restaurant.save());

    const subject = 'Your account cannot be verified properly.';
    const body = `<p>Dear ${restaurant.restaurantName},</p>
                  <p>Thank you for creating an account. It seems that your account cannot be verified properly.</p>
                  <p>The reasons could be:</p>
                  <ul>
                    <li>Insufficient details were provided.</li>
                    <li>Same business account had been created.</li>
                    <li>This business was not related to F&B industry.</li>
                    <li>We could not find the business location.</li>
                  </ul>
                  <p>If the above does not relate to you, please contact us via email: enquiry@foodpipr.com</p>
                  <br><br>
                  <p>Many thanks.</p>
                  <p>Sincerely,</p>
                  <p>Foodpipr Team</p>`;

    utils.sendMessageToUser(restaurant.restaurantMail, subject, body);

    return API.success(res, restaurant);
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
    return API.fail(res, API.errors.UNKNOWN);
  }
});
