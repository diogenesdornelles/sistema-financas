import { z } from "zod";
import GeneralValidator from "../../general.validator";
import { dateSchema } from "../../utils/date-schema";


export const createCpSchema = z
  .object({
    value: z.number().refine(GeneralValidator.validateMoney, {
      message: "Não possui o formato de dinheiro",
    }),
    due: dateSchema,
    type: z.string().uuid(),
    user: z.string().uuid(),
    supplier: z.string().uuid(),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();
