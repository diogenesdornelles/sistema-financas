import { createTcrSchema } from '../create/createTcrSchema.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const updateTcrSchema = createTcrSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .partial();
