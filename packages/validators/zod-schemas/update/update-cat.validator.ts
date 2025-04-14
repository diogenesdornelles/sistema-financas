import { z } from "zod";
import { createCatSchema } from "../create/create-cat.validator";

export const updateCatSchema = createCatSchema
  .extend({
    status: z.boolean().optional(),
  }).omit({user: true})
  .partial();
