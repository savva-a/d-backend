const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');
// const path = require('../path');
const gateway = require('../gateway');


module.exports = _async((req, res) => {
  let session = req.body.session;

  // session = _await(model.UserSession.findOne({ _id: session }).exec());
  // if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  gateway.clientToken.generate({}, function (err, response) {
    // console.log('clientToken', response.clientToken);
    return API.success(res, { clientToken: response.clientToken });
  });
});
