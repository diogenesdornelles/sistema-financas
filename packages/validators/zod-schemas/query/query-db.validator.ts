import { z } from "zod";

export const queryDbSchema = z
  .object({
    dateBalance: z
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
  })
 