import type { Request, Response } from "express";
import mongoose from "mongoose";

import { CommentModel } from "../models/Comment.js";
import { PostModel } from "../models/Post.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import { incrementComment } from "../services/postCounter.service.js";

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });

    return;
  }

  try {
    const postExists = await PostModel.exists({
      _id: postId,
    });

    if (!postExists) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });

      return;
    }

    const comments = await CommentModel.find({
      postId,
    })
      .populate("authorId", "username")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,

      comments: comments.map((comment) => ({
        id: comment._id,
        body: comment.body,
        author: comment.authorId,
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });

    return;
  }

  const result = createCommentSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message:
        result.error.issues[0]?.message ??
        "Invalid comment",
    });

    return;
  }

  try {
    const postExists = await PostModel.exists({
      _id: postId,
    });

    if (!postExists) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });

      return;
    }

    const comment = await CommentModel.create({
      postId: postId as string,
      authorId: req.userId,
      body: result.data.body,
    });

    await incrementComment(postId);

    await comment.populate(
      "authorId",
      "username"
    );

    res.status(201).json({
      success: true,

      comment: {
        id: comment.id,
        body: comment.body,
        author: comment.authorId,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};