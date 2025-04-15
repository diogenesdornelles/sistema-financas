import { z } from "zod";
import GeneralValidator from "../../general.validator";

export const createCfSchema = z
  .object({
    number: z
      .string()
      .min(3, "Número precisa ter ao menos 3 caracteres")
      .max(10, "Número precisa ter no máximo 10 caracteres"),
    ag: z
      .string()
      .max(10, "Agência precisa ter no máximo 10 caracteres")
      .optional(),
    bank: z
      .string()
      .max(30, "Banco precisa ter no máximo 30 caracteres")
      .optional(),
    balance: z.string()
      .transform((value) => GeneralValidator.validateMoneyString(value))
      .refine((value) => value !== "", {
        message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
      }),
    type: z.string().uuid("Informar o tipo"),
    user: z.string().uuid("Informar o usuário"),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();