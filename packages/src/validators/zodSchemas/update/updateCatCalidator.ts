import { createCatSchema } from '../create/createCatValidator';
import { statusBoolSchema } from '../../utils/statusBoolSchema';

export const updateCatSchema = createCatSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .omit({ user: true })
  .partial();
