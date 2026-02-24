import express from "express";

import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use(protect);

router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;