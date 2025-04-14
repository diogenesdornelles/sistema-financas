import { z } from "zod";

export const createCfSchema = z
  .object({
    number: z
      .string()
      .min(3, "Número precisa ter ao menos 3 caracteres")
      .max(10, "Número precisa ter no máximo 10 caracteres"),
    ag: z
      .string()
      .max(10, "Agência precisa ter no máximo 10 caracteres")
      .optional(),
    bank: z
      .string()
      .max(30, "Banco precisa ter no máximo 30 caracteres")
      .optional(),
    balance: z.string().min(4, "Precisa informar um valor").regex(/^\d{1,3}(\.\d{3})*(,\d{2})?$/, "Precisa ter formato dinheiro")
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
    type: z.string().uuid("Informar o tipo"),
    user: z.string().uuid("Informar o usuário"),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
  })
  .strict();