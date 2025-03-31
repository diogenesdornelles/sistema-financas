import { z } from "zod";
import { createCrSchema } from "../create/create-cr.validator";

const CrStatusEnum = z.enum(["pending", "paid", "cancelled"]);

export const updateCpSchema = createCrSchema
  .extend({
    status: CrStatusEnum.optional(),
  })
  .partial();
