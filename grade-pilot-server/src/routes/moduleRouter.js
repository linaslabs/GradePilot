import express from "express";
const router = express.Router();
import {
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/moduleControllers.js";

router.post("/", createModule);
router.route("/:id").patch(updateModule).delete(deleteModule);

export default router;
