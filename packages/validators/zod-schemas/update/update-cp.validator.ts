import { z } from "zod";
import { createCpSchema } from "../create/create-cp.validator";
import { CPStatus } from "../../../dtos/utils/enums";


export const updateCpSchema = createCpSchema
  .extend({
    status: z.nativeEnum(CPStatus).optional(),
  }).omit({user: true})
  .partial();
