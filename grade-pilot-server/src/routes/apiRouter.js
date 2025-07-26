import express from "express";
import degreeRouter from "./degreeRouter.js";
import academicYearRouter from "./academicYearRouter.js";
import moduleRouter from "./moduleRouter.js";
import assignmentRouter from "./assignmentRouter.js";
import authRouter from "./authRouter.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use(authMiddleware);

router.use("/degree", degreeRouter);
router.use("/year", academicYearRouter);
router.use("/module", moduleRouter);
router.use("/assignment", assignmentRouter);

export default router;
