import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../database/model/User.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { BadRequestError, AuthFailureError } from "../core/ApiError.js";
import { env } from "../config.js";
import { ApiError, ErrorType } from "../core/ApiError.js"; 

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, env.jwtSecret, {
    expiresIn: "7d",
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict" as const, 
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ApiError(ErrorType.UNAUTHORIZED, "Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AuthFailureError("Invalid credentials"));
    }

    const token = generateToken(user._id.toString(), user.role);

    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("jwt", "", {
      ...cookieOptions,
      maxAge: 0,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    
    if (!user) {
      return next(new ApiError(ErrorType.NOT_FOUND, "User not found"));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};