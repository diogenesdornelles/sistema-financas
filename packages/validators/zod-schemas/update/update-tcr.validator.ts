import { z } from "zod";
import {createTcrSchema} from '../create/create-tcr.validator'


export const updateTcrSchema = createTcrSchema
.extend({
  status: z.boolean().optional(),
})
.partial();
