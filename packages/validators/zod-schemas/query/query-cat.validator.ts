import { z } from "zod";
import { createCatSchema } from "../create/create-cat.validator";

export const queryCatSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.coerce.boolean(),
  obs: z.string(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial();
