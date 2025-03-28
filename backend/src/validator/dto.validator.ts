import { z } from "zod";
import GeneralValidator from "./general.validator";

export default class DTOValidator {
  /* 
      Definindo os esquemas (schemas) como propriedades privadas
      para cada tipo de validação.
  
      Para usar no frontend, basta fazer as importações e usar como na camada controller
    */

  private readonly dateSchema = z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const d = new Date(arg);
      if (!isNaN(d.getTime())) return d;
    }
    return undefined;
  }, z.date());

  private readonly createUserSchema = z
    .object({
      nome: z
        .string()
        .min(3, "Nome precisa ter ao menos 3 caracteres")
        .max(255, "Nome pode ter no máximo 255 caracteres"),
      sobrenome: z
        .string()
        .min(3, "Sobrenome precisa ter ao menos 3 caracteres")
        .max(255, "Sobrenome pode ter no máximo 255 caracteres"),
      senha: z.string().refine(GeneralValidator.isValidPwd, {
        message: `
              Ao menos 8 caracteres
              Ao menos um caracter minúsculo
              Ao menos um caracter maiúsculo
              Ao menos um dígito
              Ao menos um caracter especial 
          `,
      }),
      cpf: z.preprocess(
        (cpf) => {
          if (typeof cpf === "string") {
            return cpf.replace(/\D/g, "");
          }
          return cpf;
        },
        z
          .string()
          .refine((val) => val.length === 11, { message: "CPF deve conter 11 dígitos" })
          .refine(GeneralValidator.validateCpf, { message: "CPF inválido" })
      ),
    })
    .strict();

  private readonly updateUserSchema = this.createUserSchema.extend({
    status: z.boolean().optional(),
  }).partial();
  /*
      Métodos estáticos para validação, que recebem o objeto de entrada,
      executam o parse e retornam o objeto validado ou lançam erros caso haja divergências.
    */
  public createUser<T>(obj: T) {
    return this.createUserSchema.parse(obj);
  }

  public updateUser<T>(obj: T) {
    return this.updateUserSchema.parse(obj);
  }
}
