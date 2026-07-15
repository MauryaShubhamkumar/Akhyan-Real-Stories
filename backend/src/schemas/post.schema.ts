import { z } from "zod";

import { sanitizeText } from "../utils/sanitize.js";

const categories = [
  "struggle",
  "love",
  "school",
  "college",
  "general",
] as const;

export const createPostSchema = z.object({
  title: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(150, "Title cannot exceed 150 characters")
    ),

  body: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(10, "Story must be at least 10 characters")
        .max(20000, "Story cannot exceed 20,000 characters")
    ),

  category: z.enum(categories),

  isAnonymous: z.boolean().default(false),
});

export const postQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  category: z.enum(categories).optional(),
});