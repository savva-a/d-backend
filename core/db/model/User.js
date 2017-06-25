const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
  name: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  mail: { type: String, index: { unique: true } },
  password: { type: String, select: false },
  street: { type: String },
  city: { type: String },
  zipCode: { type: Number },
  country: { type: String },
  phone: { type: String },
  verification: { type: Boolean },
  activeAccount: { type: Boolean, default: true },

  books: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }]

});

const preSaveCb = function preSaveCb(next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (user.isModified('password')) {
    // generate a salt
    return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);

      // hash the password along with our new salt
      return bcrypt.hash(user.password, salt, (err_, hash) => {
        if (err_) return next(err_);

        // override the cleartext password with the hashed one
        user.password = hash;
        return next();
      });
    });
  }
  if (user.isModified('mail')) {
    // send verification mail
    // console.log('change mail');
    return next();
  }
  return next();
};
UserSchema.pre('save', preSaveCb);


const comparePasswordCb = function comparePasswordCb(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      console.log(`UserSchemaComparePasswordError: ${err}`); // eslint-disable-line no-console
      return cb(err);
    }
    return cb(null, isMatch);
  });
};
UserSchema.methods.comparePassword = comparePasswordCb;

module.exports = mongoose.model('User', UserSchema);
