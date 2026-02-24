import type { Response, NextFunction } from "express";
import { ProjectModel } from '../database/model/Project.js';
import { ProjectMemberModel } from "../database/model/ProjectMember.js";
import { UserModel } from "../database/model/User.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { ForbiddenError, NotFoundError } from "../core/ApiError.js";
import { BadRequestError } from "../core/ApiError.js";

export const createProject = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return next(new BadRequestError("Project name is required"));
    }

    const project = await ProjectModel.create({
      name,
      description,
      createdBy: req.user!.id,
    });

    await ProjectMemberModel.create({
      projectId: project._id,
      userId: req.user!.id,
      projectRole: "owner",
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProjects = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const memberships = await ProjectMemberModel.find({
      userId: req.user!.id,
    }).populate("projectId");

    res.json({
      count: memberships.length,
      projects: memberships
    });
  } catch (error) {
    next(error);
  }
};

export const addProjectMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const { email, role = "member" } = req.body; // Default role is 'member'

    if (!email) {
      return next(new BadRequestError("User email is required"));
    }

    if (!projectId || typeof projectId !== "string") {
      return next(new BadRequestError("Valid Project ID is required in the URL"));
    }

    const requesterMembership = await ProjectMemberModel.findOne({
      projectId,
      userId: req.user!.id,
    });

    if (!requesterMembership || requesterMembership.projectRole !== "owner") {
      return next(new ForbiddenError("Only project owners can add new members"));
    }

    // Find the user
    const userToAdd = await UserModel.findOne({ email });
    if (!userToAdd) {
      return next(new NotFoundError("No user found with that email"));
    }

    // is user already in the project
    const existingMember = await ProjectMemberModel.findOne({
      projectId,
      userId: userToAdd._id,
    });

    if (existingMember) {
      return next(new BadRequestError("User is already a member of this project"));
    }

    // Add the new member!
    const newMember = await ProjectMemberModel.create({
      projectId,
      userId: userToAdd._id,
      projectRole: role,
    });

    res.status(201).json({
      message: "Member added successfully",
      member: newMember,
    });
  } catch (error) {
    next(error);
  }
};