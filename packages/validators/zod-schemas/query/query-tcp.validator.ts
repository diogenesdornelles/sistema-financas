import { z } from "zod";
import { createTcpSchema } from "../create/create-tcp.validator";


export const queryTcpSchema = z.object({
  name: z.string(),
  status: z.coerce.boolean(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial();
