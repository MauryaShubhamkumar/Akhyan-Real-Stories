import { Router } from "express";

import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
} from "../controllers/post.controller.js";

import {
  reactToPost,
  getMyReaction,
} from "../controllers/reaction.controller.js";

import {
  getComments,
  createComment,
} from "../controllers/comment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { ensureVisitor } from "../middleware/visitor.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = Router();

router.get("/", getPosts);
router.post("/", requireAuth, createPost);

router.get("/:id/comments", getComments);

router.post(
  "/:id/comments",
  requireAuth,
  createComment
);

router.get(
  "/:id/reaction",
  requireAuth,
  getMyReaction
);

router.post(
  "/:id/react",
  requireAuth,
  reactToPost
);

router.get(
  "/:id",
  optionalAuth,
  ensureVisitor,
  getPostById
);

router.delete(
  "/:id",
  requireAuth,
  deletePost
);

export default router;