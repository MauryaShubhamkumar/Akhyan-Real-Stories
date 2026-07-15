import type { Request, Response } from "express";
import mongoose from "mongoose";

import { PostModel } from "../models/Post.js";
import { UserModel } from "../models/User.js";
import { PostViewModel } from "../models/PostView.js";
import { updateProfileSchema } from "../schemas/profile.schema.js";

export const updateMyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = updateProfileSchema.safeParse(
    req.body
  );

  if (!result.success) {
    res.status(400).json({
      success: false,
      message:
        result.error.issues[0]?.message ??
        "Invalid profile data",
    });

    return;
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        $set: result.data,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,

      profile: {
        bio: user.bio,
        employment: user.employment,
        education: user.education,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(
      req.userId
    );

    const [user, posts, categoryStats, viewStats] =
      await Promise.all([
        UserModel.findById(req.userId).lean(),

        PostModel.aggregate([
          {
            $match: {
              authorId: userId,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: "reactions",
              let: {
                postId: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$postId",
                        "$$postId",
                      ],
                    },
                  },
                },
                {
                  $group: {
                    _id: "$type",
                    count: {
                      $sum: 1,
                    },
                  },
                },
              ],
              as: "reactionCounts",
            },
          },
          {
            $project: {
              title: 1,
              body: 1,
              category: 1,
              isAnonymous: 1,
              createdAt: 1,
              reactionCounts: 1,
            },
          },
        ]),

        PostModel.aggregate([
          {
            $match: {
              authorId: userId,
            },
          },
          {
            $group: {
              _id: "$category",
              count: {
                $sum: 1,
              },
            },
          },
        ]),

        PostModel.aggregate([
          {
            $match: {
              authorId: userId,
            },
          },
          {
            $lookup: {
              from: "postviews",
              localField: "_id",
              foreignField: "postId",
              as: "views",
            },
          },
          {
            $project: {
              viewCount: {
                $size: "$views",
              },
            },
          },
          {
            $group: {
              _id: null,
              totalViews: {
                $sum: "$viewCount",
              },
            },
          },
        ]),
      ]);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    const stats = {
      totalPosts: posts.length,
      totalViews:
        viewStats[0]?.totalViews ?? 0,

      categories: {
        struggle: 0,
        love: 0,
        school: 0,
        college: 0,
        general: 0,
      } as Record<string, number>,
    };

    for (const item of categoryStats) {
      stats.categories[item._id] = item.count;
    }

    const formattedPosts = posts.map((post) => {
      const getCount = (type: string) =>
        post.reactionCounts.find(
          (item: {
            _id: string;
            count: number;
          }) => item._id === type
        )?.count ?? 0;

      return {
        id: post._id,
        title: post.title,
        body: post.body,
        category: post.category,
        isAnonymous: post.isAnonymous,

        counts: {
          likes: getCount("like"),
          dislikes: getCount("dislike"),
        },

        createdAt: post.createdAt,
      };
    });

    res.status(200).json({
      success: true,

      profile: {
        username: user.username,
        bio: user.bio,
        employment: user.employment,
        education: user.education,
        location: user.location,
        joinedAt: user.createdAt,
      },

      stats,

      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};