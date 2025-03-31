import { z } from "zod";
import GeneralValidator from "../general.validator";


export const createCfSchema = z
  .object({
    number: z
      .string()
      .min(3, "Número precisa ter ao menos 3 caracteres")
      .max(10, "Número precisa ter no máximo 10 caracteres"),
    ag: z
      .string()
      .min(1, "Agência precisa ter ao menos 1 caracter")
      .max(10, "Agência precisa ter no máximo 10 caracteres")
      .optional(),
    bank: z
      .string()
      .min(1, "Banco precisa ter ao menos 1 caracter")
      .max(30, "Banco precisa ter no máximo 30 caracteres")
      .optional(),
    balance: z.number().refine(GeneralValidator.validateMoney, {
      message: "Não possui o formato de dinheiro",
    }),
    type: z.string().uuid(),
    user: z.string().uuid(),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();
