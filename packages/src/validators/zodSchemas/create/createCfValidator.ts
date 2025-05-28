/*
Esquema de validação de crição para uma conta financeira
*/

import { z } from 'zod';

export const createCfSchema = z
  .object({
    number: z
      .string()
      .min(3, 'Número precisa ter ao menos 3 caracteres')
      .max(10, 'Número precisa ter no máximo 10 caracteres'),
    ag: z.string().max(10, 'Agência precisa ter no máximo 10 caracteres').optional(),
    bank: z.string().max(30, 'Banco precisa ter no máximo 30 caracteres').optional(),
    balance: z.string({ message: 'valor é obrigatório' }),
    type: z.string().uuid('Informar o tipo'),
    user: z.string().uuid('Informar o usuário'),
    obs: z.string().max(255, 'Observação pode ter no máximo 255 caracteres').optional(),
  })
  .strict();
