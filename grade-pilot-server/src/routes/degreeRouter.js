import express from "express";
import {
  getDegree,
  createDegree,
  updateDegree,
} from "../controllers/degreeControllers.js";
const router = express.Router();

router.post("/", createDegree);
router.get("/my-degree", getDegree);
router.patch("/:id", updateDegree); // I guess this makes it expandable if they want more degrees too...

export default router;
