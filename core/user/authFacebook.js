const _async = require('asyncawait/async');
const _await = require('asyncawait/await');

const model = require('../db/model');
const API = require('../APILib');
const utils = require('../utils');

module.exports = _async((req, res) => {
  const token = req.body.token;
  const userFacebookId = req.body.userFacebookId;
  let user;
  let userFB;
  let session;
  let fileName;

  if (!token) return API.fail(res, API.errors.ACCESS_DENIED);
  try {
    userFB = _await(API.getGoogleAuth(`https://graph.facebook.com/v2.5/me?access_token=${token}&fields=id%2Cname%2Cfirst_name%2Clast_name%2Cemail%2Cpicture.type(large)&format=json&method=get`));
  } catch (e) {
    return API.fail(res, API.errors.ACCESS_DENIED);
  }
  if (userFacebookId !== userFB.id) {
    return API.fail(res, {
      code: 401,
      text: 'ID\'s don\'t match'
    });
  }
  let _user = _await(model.User.findOne({ facebookId: userFB.id }).exec());
  if (!_user) {
    _user = _await(model.User.findOne({ mail: userFB.email }).exec());
  }
  if (!_user) {
    user = new model.User({
      mail: userFB.email,
      name: userFB.name,
      firstName: userFB.first_name,
      lastName: userFB.last_name,
      date: Date.now(),
      facebookId: userFB.id,
      verification: true
    });
    if (!userFB.picture.data.is_silhouette) {
      fileName = utils.generateRandomStringWithLowCase(24);
      user.icon = `${fileName}.jpg`;
      // user.iconThumbnail = `${fileName}-thumbnail.jpg`;

      _await(utils.uploadProfilePicture(userFB.picture.data.url, fileName, user.icon));
    }
    let location = new model.Location({
      user: user._id
    });
    session = new model.UserSession({
      user: user._id
    });
    session = _await(session.save());
    location = _await(location.save());
    user.location = location._id;
  } else {
    if (!_user.activeAccount) {
      return API.fail(res, API.errors.ACCESS_DENIED);
    }
    user = _user;
    if (!user.facebookId) {
      user.facebookId = userFB.id;
    }
    if (!user.verification) {
      user.verification = true;
    }

    session = new model.UserSession({
      user: user._id
    });
    session = _await(session.save());
  }
  user = _await(user.save());

  user = JSON.parse(JSON.stringify(user));
  utils.assign(user, { session: session._id });

  return API.success(res, user);
});
