import { z } from "zod";
// Schema para datas até hoje (inclusive)
export const dateSchemaMin = z.string().refine((val) => {
  const date = new Date(val);
  const today = new Date();

  if (isNaN(date.getTime())) return false;
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date <= today;
}, {
  message: "A data deve ser até hoje",
});
// Schema para datas iguais ou posteriores a hoje
export const dateSchemaMaj = z.string().refine((val) => {
  const date = new Date(val);
  const today = new Date();

  if (isNaN(date.getTime())) return false;
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date >= today;
}, {
  message: "A data deve ser igual ou após hoje",
});