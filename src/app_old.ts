import "dotenv/config";

import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import errorMiddleware from "./middleware/error.middleware.js";
import courseRoutes from "./routes/course.routes.js";

const app = express();

app.use(helmet());

app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:3000",
	}),
);

app.use(
	express.json({
		limit: "1mb",
	}),
);

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: "draft-8",
	legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Course Management API is running",
	});
});

app.use("/api/courses", courseRoutes);

app.use(errorMiddleware);

export default app;
