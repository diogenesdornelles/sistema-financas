import { z } from "zod";
import GeneralValidator from "../../general.validator";

// Define o schema de criação de usuário
export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome precisa ter ao menos 3 caracteres")
      .max(255, "Nome pode ter no máximo 255 caracteres"),
    surname: z
      .string()
      .min(3, "Sobrenome precisa ter ao menos 3 caracteres")
      .max(255, "Sobrenome pode ter no máximo 255 caracteres"),
    pwd: z.string().refine(GeneralValidator.isValidPwd, {
      message: `
              Ao menos 8 caracteres
              Ao menos um caracter minúsculo
              Ao menos um caracter maiúsculo
              Ao menos um dígito
              Ao menos um caracter especial 
          `,
    }),
    cpf: z.preprocess(
      (cpf) => {
        if (typeof cpf === "string") {
          return cpf.replace(/\D/g, "");
        }
        return cpf;
      },
      z
        .string()
        .refine((val) => val.length === 11, {
          message: "CPF deve conter 11 dígitos",
        })
        .refine(GeneralValidator.validateCpf, { message: "CPF inválido" }),
    ),
  })
  .strict();
