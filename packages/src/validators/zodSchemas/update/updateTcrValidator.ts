import { createTcrSchema } from '../create/createTcrValidator';
import { statusBoolSchema } from '../../utils/statusBoolSchema';

export const updateTcrSchema = createTcrSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .partial();
