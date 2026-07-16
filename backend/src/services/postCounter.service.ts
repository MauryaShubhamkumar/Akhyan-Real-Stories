import { PostModel } from "../models/Post.js";

export async function incrementLike(postId: string | any) {
  await PostModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
}

export async function decrementLike(postId: string | any) {
  await PostModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
}

export async function incrementDislike(postId: string | any) {
  await PostModel.findByIdAndUpdate(postId, { $inc: { dislikeCount: 1 } });
}

export async function decrementDislike(postId: string | any) {
  await PostModel.findByIdAndUpdate(postId, { $inc: { dislikeCount: -1 } });
}

export async function incrementComment(postId: string | any) {
  await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
}

export async function decrementComment(postId: string | any) {
  await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });
}
