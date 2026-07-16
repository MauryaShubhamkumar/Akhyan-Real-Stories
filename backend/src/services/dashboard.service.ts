import mongoose from "mongoose";
import { PostModel } from "../models/Post.js";

export async function getDashboardData(userId: string) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const posts = await PostModel.aggregate([
    {
      $match: {
        authorId: userObjectId,
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
        title: 1,
        body: 1,
        category: 1,
        isAnonymous: 1,
        createdAt: 1,
        likeCount: 1,
        dislikeCount: 1,
        commentCount: 1,
        viewCount: {
          $size: "$views",
        },
      },
    },
  ]);

  const totalPosts = posts.length;

  const totalViews = posts.reduce(
    (sum, post) => sum + (post.viewCount ?? 0),
    0
  );

  const totalLikes = posts.reduce(
    (sum, post) => sum + (post.likeCount ?? 0),
    0
  );

  const totalComments = posts.reduce(
    (sum, post) => sum + (post.commentCount ?? 0),
    0
  );

  const categories = {
    struggle: 0,
    love: 0,
    school: 0,
    college: 0,
    general: 0,
  };

  for (const post of posts) {
    const cat = post.category as keyof typeof categories;
    if (categories[cat] !== undefined) {
      categories[cat]++;
    }
  }

  const mostViewedPost =
    [...posts].sort(
      (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
    )[0] ?? null;

  return {
    totalPosts,
    totalViews,
    totalLikes,
    totalComments,
    categories,
    mostViewedPost: mostViewedPost
      ? {
          id: mostViewedPost._id,
          title: mostViewedPost.title,
          views: mostViewedPost.viewCount,
        }
      : null,
  };
}
