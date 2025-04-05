import { z } from "zod";
import { PartnerType } from "../create/create-partner.validator";
import GeneralValidator from "../../general.validator";


export const updatePartnerSchema = z
    .object({
        name: z
            .string()
            .min(3, "Nome precisa ter ao menos 3 caracteres")
            .max(100, "Nome pode ter no máximo 100 caracteres"),
        
        cod: z
            .string()
            .transform((str) => str.replace(/\D/g, ""))
            .refine((cod) => cod.length === 11 || cod.length === 14, {
                message: "Código deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)",
            }),
        
        type: z.nativeEnum(PartnerType),
        status: z.boolean(),
        obs: z
            .string()
            .max(255, "Observação pode ter no máximo 255 caracteres")
            .optional(),
    }).strict().partial()
    .superRefine((data, ctx) => {
        if (data.type === PartnerType.PF) {
            if (data.cod && data.cod.length !== 11) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["cod"],
                    message: "CPF deve ter exatamente 11 dígitos.",
                });
            } else if (data.cod && !GeneralValidator.validateCpf(data.cod)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["cod"],
                    message: "CPF inválido.",
                });
            }
        } else if (data.type === PartnerType.PJ) {
            if (data.cod && data.cod.length !== 14) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["cod"],
                    message: "CNPJ deve ter exatamente 14 dígitos.",
                });
            } else if (data.cod && !GeneralValidator.validateCNPJ(data.cod)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["cod"],
                    message: "CNPJ inválido.",
                });
            }
        }
    });

