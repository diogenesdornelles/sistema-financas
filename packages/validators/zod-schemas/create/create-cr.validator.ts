import { z } from "zod";
import GeneralValidator from "../../general.validator";

export const createCrSchema = z
  .object({
    value: z.string()
      .transform((value) => GeneralValidator.validateMoneyString(value))
      .refine((value) => value !== "", {
        message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
      }),
    due: z.string()
      .refine((date) => GeneralValidator.validateDatePostPresent(date), {
        message: "A data de vencimento deve ser maior ou igual a data atual.",
      }),
    type: z.string().uuid("Informar o tipo"),
    user: z.string().uuid("Informar o usuário"),
    customer: z.string().uuid("Informar o cliente"),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();