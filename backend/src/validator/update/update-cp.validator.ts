import { z } from "zod";
import { createCpSchema } from "../create/create-cp.validator";

const CpStatusEnum = z.enum(["pending", "paid", "cancelled"]);

export const updateCpSchema = createCpSchema
  .extend({
    status: CpStatusEnum.optional(),
  })
  .partial();
