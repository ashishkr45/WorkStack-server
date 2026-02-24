import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']),
	PORT: z.string().default('8000'),
	MONGO_URI: z.string().min(1),
	JWT_SECRET: z.string().min(10),
	CORS_URL: z.string()
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
	console.error("Invalid enviroment variables");
	console.error(parsed.error.format());
	process.exit(1)
}

export const env = {
	nodeEnv: parsed.data.NODE_ENV,
	port: parsed.data.PORT,
	mongoUrl: parsed.data.MONGO_URI,
	jwtSecret: parsed.data.JWT_SECRET,
	corsUrl: parsed.data.CORS_URL,
};