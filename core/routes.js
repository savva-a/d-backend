const multipart = require('connect-multiparty');

const book = require('./book');
const checkout = require('./checkout');

const admin = require('./admin');
const user = require('./user');
const path = require('./path');
const search = require('./search');
const restaurant = require('./restaurant');
const promotion = require('./promotion');

module.exports = (srv, express) => {
  srv.post('/book/list', book.list);
  srv.post('/book/view', book.view);
  srv.post('/book/save', book.save);
  srv.post('/book/delete', book.delete);

  srv.post('/book/upload', multipart({ uploadDir: path.PUBLIC.BOOKS }), book.upload);

  srv.post('/checkout/getClientToken', checkout.getClientToken);
  /**
   * admin panel
   */
  // admin
  srv.post('/admin/signIn', admin.signIn);
  srv.post('/admin/logout', admin.logout);
  srv.post('/admin/check', admin.sessionCheck);
  srv.post('/admin/registration', admin.registration);
  srv.post('/admin/list', admin.list);
  srv.post('/admin/delete', admin.delete);
  // users
  srv.post('/admin/users', admin.usersList);
  srv.post('/admin/user/profile', admin.userProfile);
  srv.post('/admin/user/ban', admin.userBan);
  srv.post('/admin/user/search', admin.userSearch);
  srv.post('/admin/user/profile/save', admin.userProfileSave);
  srv.post('/admin/user/profile/delete', admin.userProfileDelete);
  srv.post('/admin/user/switch', admin.userSwitch);
  srv.post('/admin/user/decline', admin.userDecline);
  srv.post('/admin/user/declineSpam', admin.userDeclineSpam);
  // restaurants
  srv.post('/admin/restaurants', admin.restaurantsList);
  srv.post('/admin/restaurant/profile', admin.restaurantProfile);
  srv.post('/admin/restaurant/restaurantVerify', admin.restaurantVerify);
  srv.post('/admin/restaurant/restaurantReject', admin.restaurantReject);
  srv.post('/admin/restaurant/restaurantSpam', admin.restaurantSpam);
  /**
   * application
   */
  // user
  srv.post('/user/auth/facebook', multipart({ uploadDir: path.PUBLIC.PROFILE_PICTURES }), user.authFacebook);
  srv.post('/user/registration', user.registration);
  // srv.post('/user/verification', user.verification);
  srv.post('/user/login', user.login);
  srv.post('/user/logout', user.logout);
  srv.post('/user/check', user.sessionCheck);
  srv.post('/user/profile', user.profile);
  srv.post('/user/profileExtended', user.profileExtended);
  srv.post('/user/profile/edit', multipart({ uploadDir: path.PUBLIC.PROFILE_PICTURES, maxFieldsSize: 10 * 1024 * 1024 }), user.profileEdit);
  srv.post('/user/restorePassword', user.passwordRestore);
  srv.post('/user/changePassword', user.passwordChange);
  srv.post('/user/sendEmail', user.sendEmail);
  srv.post('/user/savePromotion', user.savePromotion);
  srv.post('/user/redeemPromotion', user.redeemPromotion);
  srv.post('/user/follow', user.follow);
  srv.use('/user/pictures', express.static(path.PUBLIC.PROFILE_PICTURES));
  srv.post('/user/accountUpdate', user.accountUpdate);
  srv.post('/user/accountDeactivate', user.accountDeactivate);

  // search
  srv.post('/search/locations', search.locations);

  // restaurant
  srv.post('/restaurant/save', multipart({ uploadDir: path.PUBLIC.RESTAURANT_PICTURES, maxFieldsSize: 20 * 1024 * 1024 }), restaurant.save);
  srv.use('/restaurant/pictures', express.static(path.PUBLIC.RESTAURANT_PICTURES));
  srv.post('/restaurant/view', restaurant.view);
  srv.post('/restaurant/followersView', restaurant.followersView);
  srv.post('/restaurant/list', restaurant.list);

  // promotion
  srv.post('/promotion/save', multipart({ uploadDir: path.PUBLIC.PROMOTION_PICTURES, maxFieldsSize: 20 * 1024 * 1024 }), promotion.save);
  srv.use('/promotion/pictures', express.static(path.PUBLIC.PROMOTION_PICTURES));
  srv.post('/promotion/view', promotion.view);
  srv.post('/promotion/viewByRestaurant', promotion.viewByRestaurant);
  srv.post('/promotion/delete', promotion.delete);
};
