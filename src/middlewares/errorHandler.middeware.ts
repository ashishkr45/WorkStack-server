import type { ErrorRequestHandler } from 'express';
import { ApiError } from '../core/ApiError.js';
import { env } from '../config.js';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(env.nodeEnv !== 'production' && { stack: err.stack }), 
    });
  }

  // 2. Handle Mongoose Duplicate Key Error (e.g., registering an email that exists)
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate value entered for a unique field',
    });
  }

  // 3. Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    return res.status(400).json({
      status: 'error',
      message: messages.join(', '),
    });
  }

  // 4. Fallback for unknown bugs (like syntax errors or third-party crashes)
  console.error("🚨 [Unhandled Server Error]:", err);

  return res.status(500).json({
    status: 'error',
    message: env.nodeEnv === 'production' ? 'Internal Server Error' : err.message,
    ...(env.nodeEnv !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;