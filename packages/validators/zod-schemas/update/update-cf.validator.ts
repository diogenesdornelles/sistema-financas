import { z } from "zod";
import { createCfSchema } from "../create/create-cf.validator";

export const updateCfSchema = createCfSchema
  .extend({
    status: z.boolean().optional(),
  }).omit({user: true})
  .partial();
