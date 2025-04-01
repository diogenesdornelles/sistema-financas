import { z } from "zod";
import { createTcpSchema } from "../create/create-tcp.validator";


export const updateTcpSchema = createTcpSchema
.extend({
  status: z.boolean().optional(),
})
.partial();
