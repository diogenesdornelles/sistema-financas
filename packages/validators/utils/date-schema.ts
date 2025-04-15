import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const dateSchemaMin = z
  .string()
  .refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d <= today;
  }, {
    message: "A data deve ser até hoje",
  });

export const dateSchemaMaj = z
  .string()
  .refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > today;
  }, {
    message: "A data deve ser após hoje",
  });