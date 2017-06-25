const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;

  session = _await(model.UserSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  // const restaurants = session.user.restaurants;

  const restaurants = _await(model.Restaurant.find({})
  .populate([{
    model: 'Promotion',
    path: 'promotions'
  }, {
    model: 'User',
    path: 'followers'
  }])
  .exec());

  if (!restaurants.length) return API.fail(res, API.errors.NOT_FOUND);

  // if (!restaurants) return API.fail(res, API.errors.NOT_FOUND);

  return API.success(res, restaurants);
});
