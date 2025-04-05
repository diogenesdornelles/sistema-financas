import { z } from "zod";
import { createTxSchema } from "../create/create-tx.validator";


export const updateTxSchema = createTxSchema.extend({status: z.boolean().optional(),})
.partial()
.omit({user: true});
