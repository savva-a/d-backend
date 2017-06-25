const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');

module.exports = _async((req, res) => {
  let session = req.body.session;

  session = _await(model.UserSession.findOne({ _id: session })
  .populate({
    model: 'User',
    path: 'user',
    populate: {
      model: 'Restaurant',
      path: 'restaurants'
    }
  })
  .exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);
  const restaurants = session.user.restaurants;

  if (!restaurants) return API.fail(res, API.errors.NOT_FOUND);

  return API.success(res, { restaurants });
});
