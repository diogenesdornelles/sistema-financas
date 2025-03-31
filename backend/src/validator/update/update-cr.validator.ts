import { z } from "zod";
import { createCrSchema } from "../create/create-cr.validator";
import { PaymentStatus } from "../../entity/entities";

export const updateCrSchema = createCrSchema
  .extend({
    status: z.nativeEnum(PaymentStatus).optional(),
  })
  .partial();
