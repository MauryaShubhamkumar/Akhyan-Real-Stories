import { z } from "zod";

import { sanitizeText } from "../utils/sanitize.js";

export const createCommentSchema = z.object({
  body: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(1, "Comment cannot be empty")
        .max(2000, "Comment cannot exceed 2,000 characters")
    ),
});