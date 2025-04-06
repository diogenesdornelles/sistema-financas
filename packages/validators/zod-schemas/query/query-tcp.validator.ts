import { z } from "zod";
import { createTcpSchema } from "../create/create-tcp.validator";


export const queryTcpSchema = z.object({
  name: z.string(),
  status: z.coerce.boolean(),
  createdAt: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional()
    .refine((value) => !value || !isNaN(Date.parse(value)), {
      message: "Data inválida",
    }),
  updatedAt: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional()
    .refine((value) => !value || !isNaN(Date.parse(value)), {
      message: "Data inválida",
    }),
}).partial();
