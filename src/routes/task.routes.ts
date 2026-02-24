import { Router } from "express";
import { createTask, getMyTasks, updateTaskStatus, updateTaskDetails, deleteTask } from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, createTask);

router.get("/me", protect, getMyTasks); 
router.get("/project/:projectId", protect, );

// Update task routes
router.patch("/:taskId/status", protect, updateTaskStatus); // Just for drag-and-drop
router.patch("/:taskId", protect, updateTaskDetails);       // For editing text/dates

// Delete task
router.delete("/:taskId", protect, deleteTask);

export default router;