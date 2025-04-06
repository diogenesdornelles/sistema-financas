import { z } from "zod";

export const queryCfSchema = z.object({
  number: z.string(),
  balance: z.string().min(4, "Precisa ter tamanho mínimo 4").regex(/^\d{1,3}(\.\d{3})*(,\d{2})?$/, "Precisa ter formato dinheiro")
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
  type: z.string(),
  ag: z.string(),
  bank: z.string(),
  status: z.coerce.boolean(),
  obs: z.string(),
  createdAt: z.string().date(),
  updatedAt: z.string().date()
}).partial();
