const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    if (field === 'email') {
      error.message = 'This email is already registered. Please use a different email or login instead.';
    } else {
      error.message = 'Duplicate field value entered';
    }
    error.statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error.message = message;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
