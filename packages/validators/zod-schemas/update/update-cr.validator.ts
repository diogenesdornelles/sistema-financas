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
    rdate: z
    .string()
    .transform((value) => (value.trim() === "" ? undefined : value))
    .optional()
    .refine((date) => {
      if (date && date.length > 0) {
        const paymentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return paymentDate <= today;
      }
    }, {
      message: "A data de recebimento deve ser menor ou igual a data atual.",
    })
  }).omit({user: true})
  .partial().superRefine((data, ctx) => {
    console.log(data)
    console.log(ctx)
  });
