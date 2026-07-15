import type {
  NextFunction,
  Request,
  Response,
} from "express";

import crypto from "node:crypto";

const VISITOR_COOKIE = "visitor_id";

export const ensureVisitor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let visitorId = req.cookies[
    VISITOR_COOKIE
  ] as string | undefined;

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    res.cookie(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }

  req.visitorId = visitorId;

  next();
};
