export const queryKeys = {
  auth: ["auth"] as const,

  posts: {
    all: ["posts"] as const,

    list: (
      page: number,
      category?: string,
      sort?: string,
      q?: string,
    ) => [
      "posts",
      page,
      category,
      sort,
      q,
    ] as const,

    detail: (
      id: string,
    ) => [
      "post",
      id,
    ] as const,
  },

  profile: ["profile"] as const,

  notifications: ["notifications"] as const,
};
