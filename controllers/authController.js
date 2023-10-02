const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new AppError(
        'User already have an account with this email. Please login.',
        400
      )
    );
  }

  const newUser = await User.create({ name, email, password, passwordConfirm });
  sendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  const isMatched = await user.comparePassword(password);

  if (!user || !isMatched) {
    return next(new AppError('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide email', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Email could not be sent', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

  // const message = `
  //   <h1>You have requested a password reset.</h1>
  //   <p>Please go to this link to reset your password.</p>
  //   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  // `;
  const message = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
  </head>
  <body>
      <table align="center" cellpadding="0" cellspacing="0" width="600">
          <tr>
              <td bgcolor="#0077b6" style="padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff;">Password Reset</h1>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px;">
                  <p>Hello ${user.name},</p>
                  <p>We have received a request to reset your password for your [Your Website/App Name] account. To reset your password, please click the button below:</p>
                  <p style="text-align: center;">
                      <a href=${resetUrl} style="display: inline-block; padding: 10px 20px; background-color: #0077b6; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                  </p>
                  <p>If clicking the button doesn't work, copy and paste the following URL into your web browser:</p>
                  <p>[Password Reset Link]</p>
                  <p>This link will expire in [Expiration Time] for your protection.</p>
                  <p>If you did not request a password reset, please ignore this email.</p>
                  <p>Thank you for using [Your Website/App Name]. If you encounter any issues or need further assistance, please don't hesitate to contact our support team at [Support Email Address].</p>
              </td>
          </tr>
          <tr>
              <td bgcolor="#f0f0f0" style="padding: 20px; text-align: center;">
                  <p>&copy; [Your Website/App Name] [Year]</p>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      text: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent successfully check your mail!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was am error sending the email, Try again later'),
      500
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password, passwordConfirm } = req.body;

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid reset token', 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
  });
});

// PROTECT ROUTE
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('You are not logged in. Please login to get access.', 401)
    );
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User does not exist.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new AppError('Not authorized to access this route', 401));
  }
});

const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

module.exports = {
  signup,
  login,
  protect,
  getMe,
  forgotPassword,
  resetPassword,
};

// SEND JWT TOKEN
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    message: 'You are logged in successfully.',
    data: {
      user,
    },
  });
};
