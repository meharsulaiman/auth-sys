const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide your name.'],
  },
  email: {
    type: String,
    required: [true, 'Provide your email.'],
    unique: [true, 'Email already exists.'],
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Provide your password.'],
    minlength: [8, 'Password must be at least 8 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Also provide Confirm password.'],
    validate: [
      function (el) {
        return this.password === el;
      },
      'Passwords are not the same!',
    ],
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

authSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});

authSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

authSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

authSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', authSchema);

module.exports = User;
