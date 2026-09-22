// import connectDB from "../config/database.js";
// import app from "./app.js";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import connectDB from "../config/database.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
