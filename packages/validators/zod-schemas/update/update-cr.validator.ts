import { createCrSchema } from "../create/create-cr.validator";


export const updateCrSchema = createCrSchema.omit({user: true})
  .partial();
