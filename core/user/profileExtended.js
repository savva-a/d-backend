const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;

  if (session) {
    session = _await(model.UserSession.findOne({ _id: session })
    .populate({
      model: 'User',
      path: 'user',
      populate: [{
        model: 'Promotion',
        path: 'saved',
        populate: {
          model: 'Restaurant',
          path: 'restaurant'
        }
      },
      {
        model: 'Promotion',
        path: 'redeemed',
        populate: {
          model: 'Restaurant',
          path: 'restaurant'
        }
      },
      {
        model: 'Restaurant',
        path: 'following',
        populate: {
          model: 'Promotion',
          path: 'promotions'
        }
      }]
    })
    .exec());

    if (!session) return API.fail(res, API.errors.UNAUTHORIZED);
  }

  return API.success(res, session.user);
});
