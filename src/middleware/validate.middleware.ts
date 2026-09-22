import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType): RequestHandler => {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errors = Object.fromEntries(
				result.error.issues.map((issue) => [
					issue.path.join(".") || "body",
					issue.message,
				]),
			);

			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors,
			});
		}

		req.body = result.data;

		next();
	};
};
