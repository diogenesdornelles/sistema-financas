import { z } from "zod";
import GeneralValidator from "../../general.validator";

export const queryCfSchema = z
  .object({
    id: z.string().optional(),
    number: z.string().optional(),
    balance: z.string()
          .transform((value) => GeneralValidator.validateMoneyString(value))
          .refine((value) => value !== "", {
            message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
          }).optional(),
    type: z.string().optional(),
    ag: z.string().optional(),
    bank: z.string().optional(),
    status: z.coerce.boolean().optional(),
    obs: z.string().optional(),

    createdAt: z
      .string()
      .transform((value) => (value.trim() === "" ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: "Data inválida",
      }),

    updatedAt: z
      .string()
      .transform((value) => (value.trim() === "" ? undefined : value))
      .optional()
      .refine((value) => !value || !isNaN(Date.parse(value)), {
        message: "Data inválida",
      }),
  })
  .partial();