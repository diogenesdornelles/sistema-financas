import { z } from "zod";


export const createCpSchema = z
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
    due: z
    .string()
    .refine((date) => {
      const dueDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate >= today;
    }, {
      message: "A data de vencimento deve ser maior ou igual a data atual.",
    }),
    type: z.string().uuid("Informar o tipo"),
    user: z.string().uuid("Informar o usuário"),
    supplier: z.string().uuid("Informar o fornecedor"),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();
