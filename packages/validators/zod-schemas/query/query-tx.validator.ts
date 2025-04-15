import { z } from "zod";
import { TransactionSearchType } from "../../../dtos/utils/enums";
import GeneralValidator from "../../general.validator";


export const queryTxSchema = z.object({
  id: z.string().optional(),
  value: z.string()
        .transform((value) => GeneralValidator.validateMoneyString(value))
        .refine((value) => value !== "", {
          message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
        }).optional(),
  status: z.boolean(),
  obs: z.string(),
  description: z.string(),
  cf: z.string().optional(),
  cp: z.string().optional(),
  cr: z.string().optional(),
  category: z.string(),
  type: z.nativeEnum(TransactionSearchType).optional(),
  tdate: z
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
