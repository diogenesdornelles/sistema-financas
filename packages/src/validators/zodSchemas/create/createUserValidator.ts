/*
Esquema de validação de crição para um usuário
*/

import { z } from 'zod';
import { GeneralValidator } from '../../GeneralValidator';
import { RoleType } from '../../../dtos/utils/enums';

// Define o schema de criação de usuário
export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome precisa ter ao menos 3 caracteres').max(255, 'Nome pode ter no máximo 255 caracteres'),
  surname: z
    .string()
    .min(3, 'Sobrenome precisa ter ao menos 3 caracteres')
    .max(255, 'Sobrenome pode ter no máximo 255 caracteres'),
  pwd: z.string().refine(GeneralValidator.isValidPwd, {
    message: `
              Ao menos 8 caracteres
              Ao menos um caracter minúsculo
              Ao menos um caracter maiúsculo
              Ao menos um dígito
              Ao menos um caracter especial 
          `,
  }),
  role: z.nativeEnum(RoleType),
  cpf: z
    .string()
    .transform((str) => str.replace(/\D/g, ''))
    .refine(GeneralValidator.validateCpf, { message: 'CPF inválido' }),
});
