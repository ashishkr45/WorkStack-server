import type { Response, NextFunction } from "express";
import { Types } from "mongoose";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import { TaskModel } from "../database/model/Task.js";
import { ProjectMemberModel } from "../database/model/ProjectMember.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../core/ApiError.js";

export const createTask = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId || !assignedTo) {
      return next(new BadRequestError("Title, Project ID, and Assignee are required"));
    }

    const member = await ProjectMemberModel.findOne({
      projectId,
      userId: req.user!.id,
    });

    if (!member) {
      return next(new ForbiddenError("You must be a project member to create tasks"));
    }

    // Create the task
    const task = await TaskModel.create({
      title,
      description,
      projectId,
      assignedTo,
      createdBy: req.user!.id,
      priority,
      dueDate,
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Basic Validation
    if (!taskId || typeof taskId !== "string") {
      return next(new BadRequestError("Valid Task ID is required in the URL"));
    }

    const validStatuses = ["todo", "in_progress", "review", "done"];
    if (!status || !validStatuses.includes(status)) {
      return next(new BadRequestError(`Status must be one of: ${validStatuses.join(", ")}`));
    }

    // ind the task to get its projectId
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return next(new NotFoundError("Task not found"));
    }

    // Verify the user is a member of the project this task belongs to
    const member = await ProjectMemberModel.findOne({
      projectId: task.projectId,
      userId: req.user!.id,
    });

    if (!member) {
      return next(new ForbiddenError("You must be a project member to update this task"));
    }

    // Update and save
    task.status = status;
    await task.save();

    res.json({
      message: "Task status updated successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: Record<string, any> = {
      assignedTo: req.user!.id,
    };

    // Extract optional query parameters from the URL
    const { status, priority } = req.query;

    // 3. Dynamically add them to the Mongoose filter if they exist
    if (status && typeof status === "string") {
      filter.status = status;
    }
    
    if (priority && typeof priority === "string") {
      filter.priority = priority;
    }

    // query with our newly built filter object
    const tasks = await TaskModel.find(filter)
      .populate("projectId", "name") 
      .populate("createdBy", "name email") 
      .sort({ dueDate: 1 }); // Still sorting by closest due date!

    res.json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    if (!taskId || typeof taskId !== "string") {
      return next(new BadRequestError("Valid Task ID is required in the URL"));
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return next(new NotFoundError("Task not found"));
    }

    // Security: Verify the user is a member of the project
    const member = await ProjectMemberModel.findOne({
      projectId: task.projectId,
      userId: req.user!.id,
    });

    if (!member) {
      return next(new ForbiddenError("You must be a project member to edit this task"));
    }

    // Only update the fields that were actually sent in the request body
    if (title) task.title = title;
    if (description !== undefined) task.description = description; 
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;

    if (!taskId || typeof taskId !== "string") {
      return next(new BadRequestError("Valid Task ID is required in the URL"));
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return next(new NotFoundError("Task not found"));
    }

    // Fetch the user's membership to check their role
    const member = await ProjectMemberModel.findOne({
      projectId: task.projectId,
      userId: req.user!.id,
    });

    if (!member) {
      return next(new ForbiddenError("You do not have access to this project"));
    }

    // Security: Only the task creator or a project owner/manager can delete it
    const isCreator = task.createdBy.toString() === req.user!.id;
    const isManagerOrOwner = member.projectRole === "owner" || member.projectRole === "manager";

    if (!isCreator && !isManagerOrOwner) {
      return next(new ForbiddenError("Only the task creator or project managers can delete this task"));
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

