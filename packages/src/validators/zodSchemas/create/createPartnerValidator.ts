/*
Esquema de validação de crição para um parceiro
*/

import { z } from 'zod';

import { GeneralValidator } from '../../GeneralValidator';
import { PartnerType } from '../../../dtos/utils/enums';

export const createPartnerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome precisa ter ao menos 3 caracteres')
      .max(100, 'Nome pode ter no máximo 100 caracteres'),

    cod: z.string().transform((str) => str.replace(/\D/g, '')),
    type: z.nativeEnum(PartnerType),
    user: z.string().uuid('Informar o usuário'),

    obs: z.string().max(255, 'Observação pode ter no máximo 255 caracteres').optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === PartnerType.PF) {
      if (!GeneralValidator.validateCpf(data.cod)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cod'],
          message: 'CPF inválido.',
        });
      }
    } else if (data.type === PartnerType.PJ) {
      if (!GeneralValidator.validateCNPJ(data.cod)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cod'],
          message: 'CNPJ inválido.',
        });
      }
    }
  });
