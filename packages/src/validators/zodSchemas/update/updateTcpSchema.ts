import { createTcpSchema } from '../create/createTcpSchema.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const updateTcpSchema = createTcpSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .partial();
