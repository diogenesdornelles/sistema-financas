import { z } from "zod";
import { PaymentStatus } from "../../../dtos/utils/enums";
import GeneralValidator from "../../general.validator";


export const queryCrSchema = z.object({
  id: z.string().optional(),
  value: z.string()
        .transform((value) => GeneralValidator.validateMoneyString(value))
        .refine((value) => value !== "", {
          message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
        }).optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  type: z.string(),
  customer: z.string(),
  obs: z.string(),
  due: z
    .string()
    .transform((value) => (value.trim() === "" ? undefined : value))
    .optional()
    .refine((value) => !value || !isNaN(Date.parse(value)), {
      message: "Data inválida",
    }),
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
}).partial();
