import { z } from "zod";
import { createCrSchema } from "../create/create-cr.validator";

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export const updateCrSchema = createCrSchema
  .extend({
    status: z.nativeEnum(PaymentStatus).optional(),
  })
  .partial();
