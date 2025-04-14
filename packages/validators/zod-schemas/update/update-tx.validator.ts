import { z } from "zod";


export const updateTxSchema = z
  .object({
    value: z
      .string()
      .min(4, "Precisa ter tamanho mínimo 4")
      .regex(
        /^\d{1,3}(\.\d{3})*,\d{2}$/,
        "Precisa ter formato de dinheiro brasileiro (ex: 1.234,56)"
      )
      .refine(
        (valor) => {
          if (typeof valor !== "string") return false;
          const normalizado = valor.replace(/\./g, "").replace(",", ".");
          const convertido = parseFloat(normalizado);
          return !isNaN(convertido) && convertido > 0;
        },
        {
          message: "O valor deve ser maior que zero.",
        }
      ),
    cf: z.string().uuid("Informar a conta financeira (UUID)"),
    cp: z
      .string()
      .uuid("A conta de pagamento (cp) deve ser um UUID válido")
      .optional(),
    cr: z
      .string()
      .uuid("A conta de recebimento (cr) deve ser um UUID válido")
      .optional(),
    category: z.string().uuid("Informar a categoria (UUID)"),
    status: z.boolean().optional(),
    tdate: z
      .string()
      .refine(
        (dateString) => {
          if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(dateString)) return false;
          try {
            const transactionDate = new Date(dateString);
            if (isNaN(transactionDate.getTime())) return false;

            const today = new Date();
            transactionDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            return transactionDate <= today;
          } catch (e) {
            return false;
          }
        },
        {
          message:
            "A data de transação deve ser válida e menor ou igual à data atual.",
        }
      ),
    obs: z
      .string()
      .max(255, "Observação pode ter no máximo 255 caracteres")
      .optional(),
    description: z
      .string()
      .max(100, "Descrição pode ter no máximo 100 caracteres"),
  })
  .strict()
  .superRefine((data, ctx) => {
    const { cp, cr } = data;
    if (!cp && !cr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cp"],
        message:
          "É necessário informar uma conta: de pagamento (cp) OU de recebimento (cr).",
      });
    }
    if (cp && cr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cp"],
        message:
          "Apenas uma conta deve ser informada: de pagamento (cp) OU de recebimento (cr).",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cr"],
        message:
          "Apenas uma conta deve ser informada: de pagamento (cp) OU de recebimento (cr).",
      });
    }
  });
