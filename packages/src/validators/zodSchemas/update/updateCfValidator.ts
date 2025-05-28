import { createCfSchema } from '../create/createCfValidator';
import { statusBoolSchema } from '../../utils/statusBoolSchema';

export const updateCfSchema = createCfSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .omit({ user: true, balance: true })
  .partial();
