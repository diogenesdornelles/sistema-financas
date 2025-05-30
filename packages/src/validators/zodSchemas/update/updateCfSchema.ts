import { createCfSchema } from '../create/createCfSchema.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const updateCfSchema = createCfSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .omit({ user: true, balance: true })
  .partial();
