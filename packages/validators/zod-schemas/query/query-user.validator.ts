import { z } from "zod";

export const queryUserSchema = z.object({
  name: z.string(),
  surname: z.string(),
  cpf: z.string(),
  status: z.coerce.boolean(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial()

