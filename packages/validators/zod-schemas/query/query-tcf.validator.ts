import { z } from "zod";


export const queryTcfSchema = z.object({
  name: z.string(),
  status: z.coerce.boolean(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial();
