import { z } from "zod";
import GeneralValidator from "../../general.validator";
import { dateSchemaMin } from "../../utils/date-schema";


export enum TransactionType {
  ENTRY = "E",
  OUTFLOW = "O",
}

export const createTxSchema = z
  .object({
    value: z.number().refine(GeneralValidator.validateMoney, {
      message: "Não possui o formato de dinheiro",
    }),
    type: z.nativeEnum(TransactionType),
    user: z.string().uuid(),
    cf: z.string().uuid(),
    category: z.string().uuid(),
    tdate: dateSchemaMin,
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
    description: z
    .string()
    .max(255, "Descrição pode ter no máximo 255 caracteres")
    .optional(),
  })
  .strict();
