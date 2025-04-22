/*
Esquema de validação de crição para uma categoria
*/

import { z } from "zod";


export const createCatSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome precisa ter ao menos 3 caracteres")
      .max(100, "Nome pode ter no máximo 100 caracteres"),
    description: z
      .string()
      .max(255, "Descrição pode ter no máximo 255 caracteres")
      .optional(),
    user: z.string().uuid("Informar o usuário"),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();
