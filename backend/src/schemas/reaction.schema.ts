import { z } from "zod";

export const reactionSchema = z.object({
  type: z.enum(["like", "dislike", "none"]),
});