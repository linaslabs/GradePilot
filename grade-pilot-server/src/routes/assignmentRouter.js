import express from "express";
const router = express.Router();
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentControllers.js";

router.post("/", createAssignment);
router.route("/:id").patch(updateAssignment).delete(deleteAssignment);

export default router;
