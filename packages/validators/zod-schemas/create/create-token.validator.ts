/*
Esquema de validação de crição para um token
*/

import { z } from "zod";
import GeneralValidator from "../../general.validator";

export const createTokenSchema = z
  .object({
    cpf: z
      .string()
      .transform((str) => str.replace(/\D/g, ""))
      .refine(GeneralValidator.validateCpf, {
        message: "CPF em formato inválido.",
      }),
    pwd: z.string().refine(GeneralValidator.isValidPwd, {
      message: `
        Ao menos 8 caracteres
        Ao menos um caracter minúsculo
        Ao menos um caracter maiúsculo
        Ao menos um dígito
        Ao menos um caracter especial 
    `,
    }),
  })
  .strict();
