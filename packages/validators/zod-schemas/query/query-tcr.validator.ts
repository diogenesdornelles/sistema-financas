import { z } from "zod";


export const queryTcrSchema = z.object({
  name: z.string(),
  status: z.coerce.boolean(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial();
