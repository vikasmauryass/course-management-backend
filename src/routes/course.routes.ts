import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseBySlug,
  getCourses,
  updateCourse,
} from "../controllers/course.controller.js";

import { courseInputSchema } from "../middleware/course.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/", getCourses);

router.get("/slug/:slug", getCourseBySlug);

router.get("/:id", getCourseById);

router.post("/", validate(courseInputSchema), createCourse);

router.put("/:id", validate(courseInputSchema), updateCourse);

router.delete("/:id", deleteCourse);

export default router;
