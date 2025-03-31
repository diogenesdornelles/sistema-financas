import { z } from "zod";
import GeneralValidator from "../general.validator";


const TxTypeEnum = z.enum(["PF", "PJ"]);


export const createTxSchema = z
  .object({
    value: z.number().refine(GeneralValidator.validateMoney, {
      message: "Não possui o formato de dinheiro",
    }),
    type: TxTypeEnum,
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
