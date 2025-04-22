import {createTcrSchema} from '../create/create-tcr.validator'
import { statusBoolSchema } from "../../utils/status-bool-schema";


export const updateTcrSchema = createTcrSchema
.extend({
  status: statusBoolSchema.optional(),
})
.partial();
