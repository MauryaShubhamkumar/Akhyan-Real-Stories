import type { Request, Response } from "express";
import mongoose from "mongoose";

import { PostModel } from "../models/Post.js";
import { ReactionModel } from "../models/Reaction.js";
import { reactionSchema } from "../schemas/reaction.schema.js";

export const reactToPost = async (
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

  const result = reactionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid reaction type",
    });

    return;
  }

  const { type } = result.data;

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

    if (type === "none") {
      await ReactionModel.deleteOne({
        postId,
        userId: req.userId,
      });
    } else {
      await ReactionModel.findOneAndUpdate(
        {
          postId,
          userId: req.userId,
        },
        {
          $set: { type },
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
        }
      );
    }

    const [likes, dislikes] = await Promise.all([
      ReactionModel.countDocuments({
        postId,
        type: "like",
      }),

      ReactionModel.countDocuments({
        postId,
        type: "dislike",
      }),
    ]);

    res.status(200).json({
      success: true,
      reaction: type === "none" ? null : type,
      counts: {
        likes,
        dislikes,
      },
    });
  } catch (error) {
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "Reaction update conflict. Please try again.",
      });

      return;
    }

    console.error("Reaction error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyReaction = async (
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

    const reaction = await ReactionModel.findOne({
      postId,
      userId: req.userId,
    })
      .select("type")
      .lean();

    res.status(200).json({
      success: true,
      reaction: reaction?.type ?? null,
    });
  } catch (error) {
    console.error("Get reaction error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};