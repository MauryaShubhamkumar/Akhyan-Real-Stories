import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { verifyToken } from "../utils/jwt.js";

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token as
    | string
    | undefined;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyToken(token);

    req.userId = payload.userId;
  } catch {
    // Invalid token is treated as logged out.
  }

  next();
};
