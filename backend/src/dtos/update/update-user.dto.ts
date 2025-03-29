import { z } from "zod";
import { updateUserSchema } from "../../validator/update/update-user.validator";

// Infera o tipo a partir do schema
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
