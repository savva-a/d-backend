const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const AdminSchema = mongoose.Schema({
  name: { type: String },
  mail: { type: String, index: { unique: true } },
  password: { type: String, select: false }
});

const preSaveCb = function preSaveCb(next) {
  const user = this;
// only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

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
};

AdminSchema.pre('save', preSaveCb);

AdminSchema.methods.comparePassword = function comparePass(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('Admin', AdminSchema);
