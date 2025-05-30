import { z } from 'zod';
import { TransactionSearchType } from '../../../dtos/utils/enums.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const queryTxSchema = z
  .object({
    id: z.string().optional(),
    value: z.string().optional(),
    status: statusBoolSchema.optional(),
    obs: z.string().optional(),
    description: z.string(),
    cf: z.string().optional(),
    cp: z.string().optional(),
    cr: z.string().optional(),
    category: z.string().optional(),
    type: z.nativeEnum(TransactionSearchType).optional(),
    tdate: z
      .string()
      .transform((value) => (value.trim() === '' ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Data inválida',
      }),
    createdAt: z
      .string()
      .transform((value) => (value.trim() === '' ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Data inválida',
      }),

    updatedAt: z
      .string()
      .transform((value) => (value.trim() === '' ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Data inválida',
      }),
  })
  .partial();
