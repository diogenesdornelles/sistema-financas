import { z } from "zod";


export const queryTcfSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  status: z.coerce.boolean(),
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
