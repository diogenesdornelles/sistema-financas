import { z } from "zod";
import { createCpSchema } from "../create/create-cp.validator";
import { CPStatus } from "../../entity/entities";


export const updateCpSchema = createCpSchema
  .extend({
    status: z.nativeEnum(CPStatus).optional(),
  })
  .partial();
