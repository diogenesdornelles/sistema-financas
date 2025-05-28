import { z } from 'zod';
import { createTcfSchema } from '../create/createTcfValidator';
import { statusBoolSchema } from '../../utils/statusBoolSchema';

export const updateTcfSchema = createTcfSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .partial();
