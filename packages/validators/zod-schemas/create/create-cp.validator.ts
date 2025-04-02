import { z } from "zod";
import GeneralValidator from "../../general.validator";
import { dateSchemaMaj, dateSchemaMin } from "../../utils/date-schema";


export const createCpSchema = z
  .object({
    value: z.number().refine(GeneralValidator.validateMoney, {
      message: "Não possui o formato de dinheiro",
    }),
    due: dateSchemaMaj,
    pdate: dateSchemaMin,
    type: z.string().uuid(),
    user: z.string().uuid(),
    supplier: z.string().uuid(),
    tx: z.string().uuid().optional(),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();
