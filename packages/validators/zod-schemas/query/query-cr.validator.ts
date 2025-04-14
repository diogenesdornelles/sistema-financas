import { z } from "zod";
import { PaymentStatus } from "../../../dtos/utils/enums";


export const queryCrSchema = z.object({
  id: z.string().optional(),
  value: z
    .string()
    .transform((value) => (value.trim() === "" ? undefined : value.trim()))
    .optional()
    .refine(
      (value) => {
        if (value === undefined) return true;
        return value.length >= 4;
      },
      { message: "Precisa ter tamanho mínimo 4" }
    )
    .refine(
      (value) => {
        if (value === undefined) return true;
        return /^\d{1,3}(\.\d{3})*(,\d{2})?$/.test(value);
      },
      { message: "Precisa ter formato dinheiro (ex: 1.234,56)" }
    )
    .refine(
      (value) => {
        if (value === undefined) return true;
        const normalizado = value.replace(/\./g, "").replace(",", ".");
        const convertido = parseFloat(normalizado);
        return !isNaN(convertido) && convertido > 0;
      },
      { message: "O saldo deve ser um valor monetário maior que zero" }
    ),
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
