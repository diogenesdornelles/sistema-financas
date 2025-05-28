/*
Esquema de validação de crição para um tipo de conta financeira
*/

import { z } from 'zod';

export const createTcfSchema = z
  .object({
    name: z.string().min(3, 'Nome pode ter ao menos 3 caracteres').max(255, 'Nome pode ter no máximo 255 caracteres'),
  })
  .strict();
