import { z } from "zod";

import { sanitizeText } from "../utils/sanitize.js";

const optionalText = (
  maxLength: number
) =>
  z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().max(maxLength));

export const updateProfileSchema = z.object({
  bio: optionalText(300),
  employment: optionalText(150),
  education: optionalText(150),
  location: optionalText(100),
});
