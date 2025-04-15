import { z } from "zod";

export const queryUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  surname: z.string().optional(),
  cpf: z.string().optional(),
  status: z.coerce.boolean().optional(),
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
}).partial()

