import { Schema, model, type InferSchemaType } from "mongoose";

const courseSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Course name is required"],
			trim: true,
			minlength: [3, "Course name must be at least 3 characters"],
			maxlength: [100, "Course name cannot exceed 100 characters"],
		},

		slug: {
			type: String,
			required: [true, "Course slug is required"],
			unique: true,
			index: true,
			trim: true,
			lowercase: true,
		},

		description: {
			type: String,
			required: [true, "Course description is required"],
			trim: true,
			minlength: [10, "Description must be at least 10 characters"],
			maxlength: [2000, "Description cannot exceed 2000 characters"],
		},

		price: {
			type: Number,
			required: [true, "Course price is required"],
			min: [0, "Price cannot be negative"],
		},

		duration: {
			type: Number,
			required: [true, "Course duration is required"],
			min: [0.01, "Duration must be greater than 0"],
		},

		durationUnit: {
			type: String,
			required: [true, "Duration unit is required"],
			enum: {
				values: ["hours", "days", "weeks", "months"],
				message: "Invalid duration unit",
			},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export type Course = InferSchemaType<typeof courseSchema>;

export const CourseModel = model<Course>("Course", courseSchema);
