import { z } from "zod";
import { createCfSchema } from "../create/create-cf.validator";
import { statusBoolSchema } from "../../utils/status-bool-schema";

export const updateCfSchema = createCfSchema
  .extend({
    status: statusBoolSchema.optional(),
  }).omit({user: true, balance: true})
  .partial();
