import { z } from 'zod';
import { createTcfSchema } from '../create/createTcfSchema.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const updateTcfSchema = createTcfSchema
  .extend({
    status: statusBoolSchema.optional(),
  })
  .partial();
