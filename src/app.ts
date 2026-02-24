import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config.js';
import { ApiError, ErrorType } from './core/ApiError.js';
import errorHandler from './middlewares/globalErrorHandler.js'; 

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: env.coreUrl,
		credentials: true,
	}),
);

app.use(express.json({ limit: '10mb' }))
app.use('/api', routes);

app.use((req, res, next) => {
	next(new ApiError(ErrorType.NOT_FOUND, 'Route not found'));
});

app.use(errorHandler);

export default app;