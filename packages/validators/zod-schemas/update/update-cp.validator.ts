import { z } from "zod";
import { createCpSchema } from "../create/create-cp.validator";
import { CPStatus } from "../../../dtos/utils/enums";


export const updateCpSchema = createCpSchema
  .extend({
    status: z.nativeEnum(CPStatus).optional(),
    pdate: z
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
      message: "A data de pagamento deve ser menor ou igual a data atual.",
    })
  }).omit({user: true})
  .partial();
