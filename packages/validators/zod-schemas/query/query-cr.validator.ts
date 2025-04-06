import { z } from "zod";
import { PaymentStatus } from "../../../dtos/utils/enums";


export const queryCrSchema = z.object({
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
  status: z.nativeEnum(PaymentStatus).optional(),
  type: z.string(),
  customer: z.string(),
  obs: z.string(),
  tx: z.string(),
  due: z.string().date(),
  rdate: z.string().date(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial();
