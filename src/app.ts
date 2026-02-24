import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { env } from './config.js';
import { ApiError, ErrorType } from './core/ApiError.js';
import errorHandler from './middlewares/errorHandler.middeware.js'; 
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: env.corsUrl,
		credentials: true,
	}),
);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use('/api', routes);

app.use(errorHandler);

app.use((req, res, next) => {
	next(new ApiError(ErrorType.NOT_FOUND, 'Route not found'));
});

export default app;