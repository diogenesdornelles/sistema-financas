import { z } from "zod";
import { createTcfSchema } from "../create/create-tcf.validator";


export const updateTcfSchema = createTcfSchema
.extend({
  status: z.boolean().optional(),
})
.partial();
