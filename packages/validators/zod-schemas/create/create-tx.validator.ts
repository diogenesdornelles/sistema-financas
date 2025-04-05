import { z } from "zod";
import { dateSchemaMin } from "../../utils/date-schema";


export enum TransactionType {
  ENTRY = "E",
  OUTFLOW = "O",
}

export const createTxSchema = z
  .object({
    value: z.string().min(4, "Precisa ter tamanho mínimo 4").regex(/^\d{1,3}(\.\d{3})*(,\d{2})?$/, "Precisa ter formato dinheiro")
    .refine((valor) => {
      if (typeof valor !== "string") return false;

      // Remove pontos e substitui vírgula por ponto
      const normalizado = valor.replace(/\./g, "").replace(",", ".");
      const convertido = parseFloat(normalizado);

      // Verifica se é um número válido e maior que zero
      return !isNaN(convertido) && convertido > 0;
    }, {
      message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
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
