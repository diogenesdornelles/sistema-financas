import { z } from 'zod';
import { statusBoolSchema } from '../../utils/statusBoolSchema';

export const queryTcpSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    status: statusBoolSchema.optional(),
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
