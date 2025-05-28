/*
Esquema de validação de crição para um usuário com repetição de senha
*/

import { z } from 'zod';

import { createUserSchema } from './createUserValidator';

export const createUserRepPwdSchema = createUserSchema
  .extend({
    confirmPwd: z.string(),
  })
  .refine((data) => data.pwd === data.confirmPwd, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPwd'],
  });
