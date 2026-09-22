import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { CourseModel } from "../models/course.model.js";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * GET /api/courses
 */
export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              description: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const [courses, total] = await Promise.all([
      CourseModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      CourseModel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 */
export const getCourseById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course ID",
			});
		}

		const course = await CourseModel.findById(id).lean();

		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		res.status(200).json({
			success: true,
			data: course,
		});
	} catch (error) {
		next(error);
	}
};


export const getCourseBySlug = async (
	req: Request<{ slug: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { slug } = req.params;

		const course = await CourseModel.findOne({
			slug: slug.toLowerCase(),
		}).lean();

		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		res.status(200).json({
			success: true,
			data: course,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * POST /api/courses
 */
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      durationUnit,
    } = req.body;

    const slug = generateSlug(name);

    const existingCourse = await CourseModel.findOne({
      slug,
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "A course with this name already exists",
      });
    }

    const course = await CourseModel.create({
      name,
      slug,
      description,
      price,
      duration,
      durationUnit,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/courses/:id
 */
export const updateCourse = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course ID",
			});
		}

		const { name, description, price, duration, durationUnit } = req.body;

		const slug = generateSlug(name);

		const duplicateCourse = await CourseModel.findOne({
			slug,
			_id: { $ne: id },
		});

		if (duplicateCourse) {
			return res.status(409).json({
				success: false,
				message: "A course with this name already exists",
			});
		}

		const course = await CourseModel.findByIdAndUpdate(
			id,
			{
				name,
				slug,
				description,
				price,
				duration,
				durationUnit,
			},
			{
				new: true,
				runValidators: true,
			},
		).lean();

		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Course updated successfully",
			data: course,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * DELETE /api/courses/:id
 */
export const deleteCourse = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course ID",
			});
		}

		const course = await CourseModel.findByIdAndDelete(id);

		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Course deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};