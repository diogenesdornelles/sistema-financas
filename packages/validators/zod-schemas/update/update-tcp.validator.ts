import { z } from "zod";
import { createTcpSchema } from "../create/create-tcp.validator";
import { statusBoolSchema } from "../../utils/status-bool-schema";


export const updateTcpSchema = createTcpSchema
.extend({
  status: statusBoolSchema.optional(),
})
.partial();
