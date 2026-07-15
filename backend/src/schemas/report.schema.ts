import { z } from "zod";

import { sanitizeText } from "../utils/sanitize.js";

export const createReportSchema = z.object({
  targetType: z.enum(["post", "comment"]),

  targetId: z.string().min(1, "Target ID is required"),

  reason: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(3, "Please provide a reason")
        .max(500, "Reason cannot exceed 500 characters")
    ),
});