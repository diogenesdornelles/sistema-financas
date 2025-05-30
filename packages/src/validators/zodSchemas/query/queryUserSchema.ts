import { z } from 'zod';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';
import { RoleSearchType } from '../../../dtos/utils/enums.js';

export const queryUserSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    cpf: z.string().optional(),
    status: statusBoolSchema.optional(),
    createdAt: z
      .string()
      .transform((value) => (value.trim() === '' ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Data inválida',
      }),
    role: z.nativeEnum(RoleSearchType).optional(),
    updatedAt: z
      .string()
      .transform((value) => (value.trim() === '' ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: 'Data inválida',
      }),
  })
  .partial();
