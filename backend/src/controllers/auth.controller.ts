import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UserModel } from "../models/User.js";
import { signupSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateToken } from "../utils/jwt.js";

const COOKIE_NAME = "token";

const isProduction =
  process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction
    ? ("none" as const)
    : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid input",
    });

    return;
  }

  const { username, email, password } = result.data;

  try {
    const existingUser = await UserModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username },
      ],
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          existingUser.email === email.toLowerCase()
            ? "Email already registered"
            : "Username already taken",
      });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      username,
      email,
      passwordHash,
    });

    const token = generateToken(user.id);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid input",
    });

    return;
  }

  const { email, password } = result.data;

  try {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    const token = generateToken(user.id);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = (
  _req: Request,
  res: Response
): void => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction
      ? "none"
      : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};