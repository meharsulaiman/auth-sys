const AppError = require('../utils/AppError');

const globalErrorController = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    err = new AppError(message, 400);
  }

  console.log(err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err.message || 'Internal server Error.',
  });
};

module.exports = globalErrorController;
