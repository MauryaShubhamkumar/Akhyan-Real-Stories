import { api } from "../../api/client";

import type { Category, Post, Pagination } from "../../types";

export async function getPosts(params: {
  page: number;
  category?: Category | "";
  sort?: string;
  q?: string;
}): Promise<{ posts: Post[]; pagination: Pagination }> {
  const cleanParams = {
    page: params.page,
    ...(params.category ? { category: params.category } : {}),
    ...(params.sort ? { sort: params.sort } : {}),
    ...(params.q ? { q: params.q } : {}),
  };

  const response = await api.get("/posts", {
    params: cleanParams,
  });

  return response.data;
}

export async function getPost(postId: string): Promise<{ post: Post }> {
  const response = await api.get(
    `/posts/${postId}`
  );

  return response.data;
}

export async function createPost(data: {
  title: string;
  body: string;
  category: Category;
  isAnonymous: boolean;
}): Promise<{ post: Post }> {
  const response = await api.post(
    "/posts",
    data
  );

  return response.data;
}

export async function deletePost(
  id: string
) {
  await api.delete(`/posts/${id}`);
}

export async function getPostReaction(postId: string) {
  const response = await api.get(`/posts/${postId}/reaction`);
  return response.data;
}

export async function reactToPost(postId: string, type: "like" | "dislike" | "none") {
  const response = await api.post(`/posts/${postId}/react`, { type });
  return response.data;
}

export async function reportContent(data: { targetType: string; targetId: string; reason: string }) {
  const response = await api.post("/reports", data);
  return response.data;
}
