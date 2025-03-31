import { z } from "zod";
import { createUserSchema } from "../create/create-user.validator";

export const updateUserSchema = createUserSchema
  .extend({
    status: z.boolean().optional(),
  })
  .partial();
