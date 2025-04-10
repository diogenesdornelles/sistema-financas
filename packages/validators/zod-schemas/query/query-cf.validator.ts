import { z } from "zod";

export const queryCfSchema = z
  .object({
    id: z.string().optional(),
    number: z.string().optional(),

    balance: z
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