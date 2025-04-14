import { createCpSchema } from "../create/create-cp.validator";

export const updateCpSchema = createCpSchema.omit({user: true})
  .partial();
