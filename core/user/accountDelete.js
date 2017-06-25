const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const fs = require('fs');

const model = require('../db/model');
const API = require('../APILib');
const path = require('../path');
const userDeleteDialog = require('../utils').userDeleteDialog;

module.exports = _async((req, res) => {
  let session = req.body.session;
  // let products;

  session = _await(model.UserSession.findOne({ _id: session }).populate('user').exec());
  if (!session) return API.fail(res, API.errors.UNAUTHORIZED);

  const products = _await(model.Product.find({ user: session.user._id }).populate('category').exec());
  if (products) {
    products.forEach((_product) => {
      const product = _product;
      product.category.productsCounts -= 1;
      if (products.pictures && products.pictures.length) {
        product.pictures.forEach((picture) => {
          try {
            fs.unlinkSync(`${path.PUBLIC.PRODUCT_PICTURES}/${picture}`);
          } catch (e) {
            console.log(`Product picture error: ${e}`);  // eslint-disable-line no-console
          }
        });
      }

      // const category = _await(product.category.save());
      _await(product.category.save());
      _await(product.remove());
    });
  }

  const dialogs = _await(model.ChatDialog.find(
    {
      $or: [{ user0: session.user._id }, { user1: session.user._id }]
    }
  ).exec());
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

      _await(userDeleteDialog(dialog, user0, user1, session.user._id));
    });
  }

  if (session.user.icon && session.user.icon.length) {
    try {
      fs.unlinkSync(`${path.PUBLIC.PROFILE_PICTURES}/${session.user.icon}`);
      fs.unlinkSync(`${path.PUBLIC.PROFILE_PICTURES}/${session.user.iconThumbnail}`);
    } catch (e) {
      console.log(`Icon error: ${e}`); // eslint-disable-line no-console
    }
  }
  if (session.user.banner && session.user.banner.length) {
    try {
      fs.unlinkSync(`${path.PUBLIC.PROFILE_PICTURES}/${session.user.banner}`);
      fs.unlinkSync(`${path.PUBLIC.PROFILE_PICTURES}/${session.user.bannerThumbnail}`);
    } catch (e) {
      console.log(`Banner error: ${e}`); // eslint-disable-line no-console
    }
  }
  const sessions = _await(model.UserSession.find({ user: session.user._id }).exec());
  if (sessions) {
    sessions.forEach((_session) => {
      _session.remove();
    });
  }
  _await(session.user.remove());
  return API.success(res, 'Account was deleted');
});
