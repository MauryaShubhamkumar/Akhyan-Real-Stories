export function getSort(sort: string) {
  switch (sort) {
    case "top":
      return {
        likeCount: -1,
        createdAt: -1,
      };

    case "new":
      return {
        createdAt: -1,
      };

    default:
      return {
        createdAt: -1,
      };
  }
}

export function trendingScore(post: any): number {
  const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / 1000 / 60 / 60;
  const views = Number(post.views ?? 0);
  return (
    (
      Number(post.likeCount ?? 0) +
      Number(post.commentCount ?? 0) * 2 -
      Number(post.dislikeCount ?? 0) * 0.5 +
      Math.log10(views + 1)
    ) /
    Math.pow(ageHours + 2, 1.5)
  );
}
