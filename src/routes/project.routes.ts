import { Router } from "express";
import { createProject, getMyProjects, addProjectMember } from "../controllers/project.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);
router.post("/:projectId/members", protect, addProjectMember);

export default router;