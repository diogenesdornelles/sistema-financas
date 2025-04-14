import { z } from "zod";

const isValidDateFormat = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(date);
};

export const dateSchemaMaj = z.preprocess(
  (arg) => {
    if (typeof arg === "string" && isValidDateFormat(arg)) {
      const d = new Date(arg);
      if (!isNaN(d.getTime())) return d;
    }
    return undefined;
  },
  z.date().refine((date) => date > new Date(), {
    message: "A data deve ser maior que a data atual",
  }),
);

export const dateSchemaMin = z.preprocess(
  (arg) => {
    if (typeof arg === "string" && isValidDateFormat(arg)) {
      const d = new Date(arg);
      if (!isNaN(d.getTime())) return d;
    }
    return undefined;
  },
  z.date().refine((date) => date <= new Date(), {
    message: "A data deve ser menor ou igual à data atual",
  }),
);