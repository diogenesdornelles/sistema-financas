import { z } from "zod";
import { createTxSchema } from "../create/create-tx.validator";



export const updateTcrSchema = createTxSchema
.extend({
  status: z.boolean().optional(),
})
.partial();
