import express from "express";
const router = express.Router();
import {
  getAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYearControllers.js";

router.route("/:id").get(getAcademicYear).patch(updateAcademicYear);

export default router;
