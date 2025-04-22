import { createCatSchema } from "../create/create-cat.validator";
import { statusBoolSchema } from "../../utils/status-bool-schema";

export const updateCatSchema = createCatSchema
  .extend({
    status: statusBoolSchema.optional(),
  }).omit({user: true})
  .partial();
