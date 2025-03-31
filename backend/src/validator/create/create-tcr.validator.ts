import { z } from "zod";


export const createTcrSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome pode ter ao menos 3 caracteres")
      .max(255, "Nome pode ter no máximo 255 caracteres")
  })
  .strict();
