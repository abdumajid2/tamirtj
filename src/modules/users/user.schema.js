import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["client", "master", "admin"]).optional(),
  balance: z.number().int().min(0).optional()
});
