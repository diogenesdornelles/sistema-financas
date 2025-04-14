import { z } from "zod";
import { createCrSchema } from "../create/create-cr.validator";
import { PaymentStatus } from "../../../dtos/utils/enums";


export const updateCrSchema = createCrSchema
  .extend({
    status: z.nativeEnum(PaymentStatus).optional(),
  }).omit({user: true})
  .partial();
