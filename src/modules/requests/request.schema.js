import { z } from "zod";
export const createRequestSchema = z.object({
  title: z.string().min(3),
  city: z.string().min(2)
});
