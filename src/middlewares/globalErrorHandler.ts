import type { ErrorRequestHandler } from 'express'
import { ApiError } from '../core/ApiError.js';
import { env } from '../config.js';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	}

	console.error(err);

	return res.status(500).json({
		status: 'error',
		message:
		env.nodeEnv === 'production'
			? 'Something went wrong'
			: err.message,
	});
};

export default errorHandler; 