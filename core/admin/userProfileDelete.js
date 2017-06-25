const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const fs = require('fs');

const model = require('../db/model');
const API = require('../APILib');
const path = require('../path');
const userDeleteDialog = require('../utils').userDeleteDialog;

module.exports = _async((req, res) => {
  let session = req.body.session;
  let user = req.body.user;
  // let products;
  // let sessions;

  session = _await(model.AdminSession.findOne({ _id: session }).exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  user = _await(model.User.findOne({ _id: user }).exec());
  if (!user) return API.fail(res, API.errors.USER_NOT_FOUND);

  const sessions = _await(model.UserSession.find({ user: user._id }).exec());
  if (sessions && sessions.length) {
    sessions.forEach((_session) => {
      _await(_session.remove());
    });
  }

  const products = _await(model.Product.find({ user: user._id }).exec());
  if (products) {
    products.forEach((_product) => {
      const product = _product;
      product.category.productsCounts -= 1;
      _await(product.category.save());
      if (product.pictures.length) {
        product.pictures.forEach((picture) => {
          try {
            fs.unlink(`${path.PUBLIC.PRODUCT_PICTURES}/${picture}`);
          } catch (e) {
            console.log(e); // eslint-disable-line no-console
          }
        });
      }
      product.remove();
    });
  }

  const dialogs = _await(model.ChatDialog.find({
    $or: [
      { user0: session.user },
      { user1: session.user }]
  }).exec());
  if (dialogs) {
    dialogs.forEach((dialog) => {
      let user0;
      let user1;
      if (dialog.user0) {
        user0 = _await(model.User.findOne({ _id: dialog.user0 }).exec());
      }
      if (dialog.user1) {
        user1 = _await(model.User.findOne({ _id: dialog.user1 }).exec());
      }

      _await(userDeleteDialog(dialog, user0, user1, session.user));
    });
  }

  // _await(user.location.remove());
  if (user.banner) {
    try {
      fs.unlink(`${path.PUBLIC.PROFILE_PICTURES}/${user.banner}`);
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
  }
  if (user.icon) {
    try {
      fs.unlink(`${path.PUBLIC.PROFILE_PICTURES}/${user.icon}`);
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
  }
  _await(user.remove());
  return API.success(res, 'Profile was deleted');
});
