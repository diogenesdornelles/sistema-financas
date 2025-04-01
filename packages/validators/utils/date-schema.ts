import { z } from "zod";

export const dateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const d = new Date(arg);
      if (!isNaN(d.getTime())) return d;
    }
    return undefined;
  },
  z.date().refine((date) => date > new Date(), {
    message: "A data deve ser maior que a data atual",
  }),
);
