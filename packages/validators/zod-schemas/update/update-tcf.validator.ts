import { z } from "zod";
import { createTcfSchema } from "../create/create-tcf.validator";
import { statusBoolSchema } from "../../utils/status-bool-schema";


export const updateTcfSchema = createTcfSchema
.extend({
  status: statusBoolSchema.optional(),
})
.partial();
