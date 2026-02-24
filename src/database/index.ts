import mongoose from "mongoose";
import { env } from "../config.js";

const dbURL = env.mongoUrl;

// create a db connection
mongoose
	.connect(dbURL as string)
	.then(() => console.log(`Mongoose connection done`))
	.catch((err) => {
		console.log(`Mongoose connection error`)
		console.error(err)
	})

// CONNECTION EVENT
// when successfully connected
mongoose.connection.on('connected', () => {
	console.log('Mongoose default connection open to ' + dbURL);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
	console.error('Mongoose default connection error: ' + err);
});

// when the connection is disconnected
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose default connection disconnected');
});

export default mongoose.connection;