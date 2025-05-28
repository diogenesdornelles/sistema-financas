/*
Esquema de validação de crição para uma conta a pagar
*/

import { z } from 'zod';
import { GeneralValidator } from '../../GeneralValidator';

export const createCpSchema = z
  .object({
    value: z.string({ message: 'valor é obrigatório' }),
    due: z.string().refine((date) => GeneralValidator.validateDatePostPresent(date), {
      message: 'A data de vencimento deve ser maior ou igual a data atual.',
    }),
    type: z.string().uuid('Informar o tipo'),
    user: z.string().uuid('Informar o usuário'),
    supplier: z.string().uuid('Informar o fornecedor'),
    obs: z.string().max(255, 'Observação pode ter no máximo 255 caracteres').optional(),
  })
  .strict();
