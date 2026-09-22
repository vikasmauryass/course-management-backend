import { z } from "zod";

export const courseInputSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "Course name must be at least 3 characters")
		.max(100, "Course name cannot exceed 100 characters"),

	description: z
		.string()
		.trim()
		.min(10, "Description must be at least 10 characters")
		.max(2000, "Description cannot exceed 2000 characters"),

	price: z.coerce.number().finite().min(0, "Price cannot be negative"),

	duration: z.coerce
		.number()
		.finite()
		.positive("Duration must be greater than 0"),

	durationUnit: z.enum(["hours", "days", "weeks", "months"]),
});
