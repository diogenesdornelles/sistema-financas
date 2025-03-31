import { z } from "zod";
import GeneralValidator from "../general.validator";
import { TransactionType } from "../../entity/entities";


export const createTxSchema = z
  .object({
    value: z.number().refine(GeneralValidator.validateMoney, {
      message: "Não possui o formato de dinheiro",
    }),
    type: z.nativeEnum(TransactionType),
    user: z.string().uuid(),
    cf: z.string().uuid(),
    category: z.string().uuid(),
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
