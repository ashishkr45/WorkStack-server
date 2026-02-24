import { env } from "./config.js";
import app from "./app.js";

app
	.listen(env.port, () => {
		console.log(`Server is running on port: ${env.port}`)
	})
	.on('error', (err) => console.log(`Error while starting the Server`));
