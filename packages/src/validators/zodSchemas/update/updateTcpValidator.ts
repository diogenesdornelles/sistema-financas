import { createTcpSchema } from '../create/createTcpValidator';
import { statusBoolSchema } from '../../utils/statusBoolSchema';

export const updateTcpSchema = createTcpSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .partial();
