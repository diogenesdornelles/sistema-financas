import { z } from 'zod';
import { PaymentStatus } from '../../../dtos/utils/enums';

export const queryCpSchema = z
  .object({
    id: z.string().optional(),
    value: z.string().optional(),
    status: z.nativeEnum(PaymentStatus).optional(),
    type: z.string().optional(), // procura por nome de tipo
    supplier: z.string().optional(), // procura por nome de fornecedor
    obs: z.string().optional(),
    due: z
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
