import { z } from "zod";
import GeneralValidator from "../../general.validator";

export const createTxSchema = z
  .object({
    value: z.string()
      .transform((value) => GeneralValidator.validateMoneyString(value))
      .refine((value) => value !== "", {
        message: "O saldo deve estar no formato monetário brasileiro (ex.: 1.234,56)",
      }),
    user: z.string().uuid("Informar o usuário (UUID)"),
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
    tdate: z
      .string()
      .refine(
        (dateString) => GeneralValidator.validateDateUntilPresent(dateString),
        {
          message: "A data de transação deve ser válida e menor ou igual à data atual.",
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
