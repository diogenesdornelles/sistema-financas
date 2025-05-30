import { createCatSchema } from '../create/createCatSchema.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const updateCatSchema = createCatSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .omit({ user: true })
  .partial();
