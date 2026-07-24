import type { Request, Response } from "express";
import mongoose from "mongoose";


import { PostModel } from "../models/Post.js";
import {
  createPostSchema,
  getPostsQuerySchema,
} from "../schemas/post.schema.js";
import { ReactionModel } from "../models/Reaction.js";
import { CommentModel } from "../models/Comment.js";
import { ReportModel } from "../models/Report.js";
import { PostViewModel } from "../models/PostView.js";
import { calculateReadingTime } from "../utils/readingTime.js";
import { buildPostFilter } from "../services/post.service.js";
import { getSort, trendingScore } from "../utils/postSort.js";

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid input",
    });

    return;
  }

  try {
    const post = await PostModel.create({
      ...result.data,
      authorId: req.userId,
    });

    res.status(201).json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        body: post.body,
        category: post.category,
        isAnonymous: post.isAnonymous,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = getPostsQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid query parameters",
    });

    return;
  }

  const { page, limit, category, q, sort } = result.data;

  const filter = buildPostFilter({
    page,
    limit,
    category,
    q,
  });

  try {
    const pipeline: any[] = [
      {
        $match: filter,
      },
    ];

    if (sort !== "trending") {
      pipeline.push(
        {
          $sort: getSort(sort) as any,
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        }
      );
    } else {
      pipeline.push({
        $sort: { createdAt: -1 },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
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
          likeCount: 1,
          dislikeCount: 1,
          commentCount: 1,
          views: {
            $size: "$views",
          },

          author: {
            $cond: [
              "$isAnonymous",
              null,
              {
                id: {
                  $arrayElemAt: [
                    "$author._id",
                    0,
                  ],
                },
                username: {
                  $arrayElemAt: [
                    "$author.username",
                    0,
                  ],
                },
              },
            ],
          },

          counts: {
            likes: {
              $ifNull: [
                {
                  $let: {
                    vars: {
                      likeData: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reactionCounts",
                              as: "reaction",
                              cond: {
                                $eq: [
                                  "$$reaction._id",
                                  "like",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$likeData.count",
                  },
                },
                0,
              ],
            },

            dislikes: {
              $ifNull: [
                {
                  $let: {
                    vars: {
                      dislikeData: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$reactionCounts",
                              as: "reaction",
                              cond: {
                                $eq: [
                                  "$$reaction._id",
                                  "dislike",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: "$$dislikeData.count",
                  },
                },
                0,
              ],
            },
          },
        },
      }
    );

    let [posts, totalPosts] = await Promise.all([
      PostModel.aggregate(pipeline),
      PostModel.countDocuments(filter),
    ]);

    if (sort === "trending") {
      posts = posts
        .map((post) => ({
          ...post,
          score: trendingScore(post),
        }))
        .sort((a, b) => b.score - a.score);

      // Paginate in memory
      posts = posts.slice((page - 1) * limit, page * limit);
    }

    res.status(200).json({
      success: true,
      posts: posts.map((post) => ({
        id: post._id,
        ...post,
        _id: undefined,
        readingTime: calculateReadingTime(post.body),
      })),

      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(
          totalPosts / limit
        ),
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });

    return;
  }

  try {
    const post = await PostModel.findById(id)
      .populate("authorId", "username")
      .lean();

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });

      return;
    }

    const viewerKey = req.userId
      ? `user:${req.userId}`
      : `visitor:${req.visitorId}`;

    if (viewerKey) {
      try {
        await PostViewModel.updateOne(
          {
            postId: post._id,
            viewerKey,
          },
          {
            $setOnInsert: {
              postId: post._id,
              viewerKey,
            },
          },
          {
            upsert: true,
          }
        );
      } catch (error) {
        if (
          !(
            error instanceof
              mongoose.mongo.MongoServerError &&
            error.code === 11000
          )
        ) {
          console.error(
            "Record post view error:",
            error
          );
        }
      }
    }

    const [likes, dislikes, views] = await Promise.all([
      ReactionModel.countDocuments({
        postId: post._id,
        type: "like",
      }),

      ReactionModel.countDocuments({
        postId: post._id,
        type: "dislike",
      }),

      PostViewModel.countDocuments({
        postId: post._id,
      }),
    ]);

    res.status(200).json({
      success: true,

      post: {
        id: post._id,
        title: post.title,
        body: post.body,
        category: post.category,
        isAnonymous: post.isAnonymous,

        author: post.isAnonymous
          ? null
          : post.authorId,

        counts: {
          likes,
          dislikes,
        },
        views,
        readingTime: calculateReadingTime(post.body),

        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error("Get post error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });

    return;
  }

  try {
    const post = await PostModel.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });

      return;
    }

    if (post.authorId.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: "You cannot delete this post",
      });

      return;
    }

    const commentIds = await CommentModel.find({
      postId: post._id,
    }).distinct("_id");

    await Promise.all([
      ReactionModel.deleteMany({
        postId: post._id,
      }),

      CommentModel.deleteMany({
        postId: post._id,
      }),

      PostViewModel.deleteMany({
        postId: post._id,
      }),

      ReportModel.deleteMany({
        $or: [
          {
            targetType: "post",
            targetId: post._id,
          },
          {
            targetType: "comment",
            targetId: {
              $in: commentIds,
            },
          },
        ],
      }),

      post.deleteOne(),
    ]);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};