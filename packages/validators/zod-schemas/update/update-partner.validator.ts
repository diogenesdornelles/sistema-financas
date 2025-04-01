import { z } from "zod";
import { createPartnerSchema } from "../create/create-partner.validator";


export const updatePartnerSchema = createPartnerSchema
  .extend({
    status: z.boolean().optional(),
  })
  .partial();
