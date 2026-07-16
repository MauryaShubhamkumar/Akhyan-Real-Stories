import { api } from "../../api/client";

export async function getComments(
  postId: string
) {
  const response = await api.get(
    `/posts/${postId}/comments`
  );

  return response.data;
}

export async function createComment(
  postId: string,
  body: string
) {
  const response = await api.post(
    `/posts/${postId}/comments`,
    { body }
  );

  return response.data;
}
