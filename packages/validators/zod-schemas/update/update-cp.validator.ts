import { z } from "zod";
import { createCpSchema } from "../create/create-cp.validator";

export enum CPStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export const updateCpSchema = createCpSchema
  .extend({
    status: z.nativeEnum(CPStatus).optional(),
  }).omit({user: true})
  .partial();
