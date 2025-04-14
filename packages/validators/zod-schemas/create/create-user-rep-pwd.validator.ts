import { z } from "zod";

import { createUserSchema } from "./create-user.validator"


export const createUserRepPwdSchema = createUserSchema.extend({
    confirmPwd: z.string(),
 }).refine((data) => data.pwd === data.confirmPwd, {
    message: "As senhas devem ser iguais",
    path: ["confirmPwd"],
})