export interface User {
  id: string;
  username: string;
  email: string;
}

export type Category =
  | "struggle"
  | "love"
  | "school"
  | "college"
  | "general";

export interface Author {
  _id?: string;
  id?: string;
  username: string;
}

export interface ReactionCounts {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  category: Category;
  isAnonymous: boolean;
  author: Author | null;
  counts: ReactionCounts;
  createdAt: string;
}

export interface Comment {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
}
export interface Pagination {
  page: number;
  limit: number;
  totalPosts: number;
  totalPages: number;
}

export interface ProfileData {
  username: string;
  bio: string;
  employment: string;
  education: string;
  location: string;
  joinedAt: string;
}

export interface ProfileStats {
  totalPosts: number;
  totalViews: number;

  categories: Record<Category, number>;
}

export interface ProfileResponse {
  profile: ProfileData;
  stats: ProfileStats;
  posts: Post[];
}