import { z } from 'zod';
import GeneralValidator from '../../general.validator';
import { statusBoolSchema } from '../../utils/statusBoolSchema';
import { RoleType } from '../../../dtos/utils/enums';

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .transform((value) => (!value || !value.trim() ? undefined : value))
      .optional()
      .refine((value) => (value && value?.length < 3 ? undefined : value), {
        message: 'Nome precisa ter ao menos 3 caracteres',
      })
      .refine((value) => (value && value?.length > 255 ? undefined : value), {
        message: 'Nome pode ter no máximo 255 caracteres',
      }),
    surname: z
      .string()
      .transform((value) => (!value.trim() ? undefined : value))
      .optional()
      .refine((value) => (value && value?.length < 3 ? undefined : value), {
        message: 'Sobrenome precisa ter ao menos 3 caracteres',
      })
      .refine((value) => (value && value?.length > 255 ? undefined : value), {
        message: 'Sobrenome pode ter no máximo 255 caracteres',
      }),
    role: z.nativeEnum(RoleType).optional(),
    pwd: z
      .string()
      .transform((value) => (!value || !value.trim() ? undefined : value))
      .optional()
      .refine((value) => value === undefined || GeneralValidator.isValidPwd(value), {
        message: `
                  Ao menos 8 caracteres
                  Ao menos um caracter minúsculo
                  Ao menos um caracter maiúsculo
                  Ao menos um dígito
                  Ao menos um caracter especial 
              `,
      }),
    cpf: z
      .string()
      .transform((str) => str.replace(/\D/g, ''))
      .transform((value) => (!value || !value.trim() ? undefined : value))
      .optional()
      .refine((value) => value && GeneralValidator.validateCpf, { message: 'CPF inválido' }),
    status: statusBoolSchema.optional(),
  })
  .partial()
  .superRefine((data, cxt) => {
    console.log(data);
  });
