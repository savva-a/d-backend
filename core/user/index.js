const registration = require('./registration');
const login = require('./login');
const logout = require('./logout');
const sessionCheck = require('./sessionCheck');
const profile = require('./profile');
const profileExtended = require('./profileExtended');
const profileEdit = require('./profileEdit');
const sendEmail = require('./sendEmail');
const passwordRestore = require('./passwordRestore');
const passwordChange = require('./passwordChange');
// const accountDelete = require('./accountDelete');
const accountDeactivate = require('./accountDeactivate');
const authFacebook = require('./authFacebook');
// const verification = require('./verification');
const accountUpdate = require('./accountUpdate');
const savePromotion = require('./savePromotion');
const redeemPromotion = require('./redeemPromotion');
const follow = require('./follow');

module.exports = {
  registration,
  login,
  logout,
  sessionCheck,
  profile,
  profileExtended,
  profileEdit,
  sendEmail,
  passwordRestore,
  passwordChange,
  // accountDelete,
  accountDeactivate,
  authFacebook,
  // verification,
  accountUpdate,
  follow,
  redeemPromotion,
  savePromotion
};
