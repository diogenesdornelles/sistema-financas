import { z } from 'zod';

import { GeneralValidator } from '../../GeneralValidator.js';
import { PartnerType } from '../../../dtos/utils/enums.js';
import { statusBoolSchema } from '../../utils/statusBoolSchema.js';

export const updatePartnerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome precisa ter ao menos 3 caracteres')
      .max(100, 'Nome pode ter no máximo 100 caracteres')
      .optional(),

    cod: z.string().transform((str) => str.replace(/\D/g, '')),
    type: z.nativeEnum(PartnerType).optional(),
    status: statusBoolSchema.optional(),
    obs: z.string().max(255, 'Observação pode ter no máximo 255 caracteres').optional(),
  })
  .strict()
  .partial()
  .superRefine((data, ctx) => {
    if (data.type === PartnerType.PF) {
      if (data.cod && !GeneralValidator.validateCpf(data.cod)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cod'],
          message: 'CPF inválido.',
        });
      }
    } else if (data.type === PartnerType.PJ) {
      if (data.cod && !GeneralValidator.validateCNPJ(data.cod)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cod'],
          message: 'CNPJ inválido.',
        });
      }
    }
  });
