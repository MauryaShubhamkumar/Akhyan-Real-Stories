export interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  categories: {
    struggle: number;
    love: number;
    school: number;
    college: number;
    general: number;
  };
  mostViewedPost: {
    id: string;
    title: string;
    views: number;
  } | null;
}
