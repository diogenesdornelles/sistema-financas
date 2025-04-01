import { z } from "zod";

import GeneralValidator from "../../general.validator";

export enum PartnerType {
    PF = "PF",
    PJ = "PJ",
  }
  

export const createPartnerSchema = z
    .object({
        name: z
            .string()
            .min(3, "Nome precisa ter ao menos 3 caracteres")
            .max(100, "Nome pode ter no máximo 100 caracteres"),

        cod: z.preprocess(
            (cod) => {
                if (typeof cod === "string") {
                    return cod.replace(/\D/g, "");
                }
                return cod;
            },
            z
                .string()
                .refine((val) => val.length === 11 || val.length === 14, {
                    message: "Código deve conter 11 ou 14 dígitos",
                })
                .refine(
                    (val) => GeneralValidator.validateCpf(val) || GeneralValidator.validateCNPJ(val),
                    {
                        message: "Código (cpf ou cnpj) inválido",
                    }
                )
        ),
        type: z.nativeEnum(PartnerType),
        user: z.string().uuid(),
        obs: z
            .string()
            .max(255, "Observação pode ter no máximo 255 caracteres")
            .optional(),
    })
    .strict();
