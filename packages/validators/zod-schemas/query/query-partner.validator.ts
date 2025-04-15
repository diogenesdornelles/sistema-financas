import { z } from "zod";
import { PartnerSearchType } from "../../../dtos/utils/enums";



export const queryPartnerSchema = z
    .object({
        id: z.string().optional(),
        name: z
            .string().optional(),
        cod: z
            .string()
            .optional()
            .transform((str) => str && str.replace(/\D/g, "")),
        createdAt: z
            .string()
            .transform((value) => (value.trim() === "" ? undefined : value))
            .optional()
            .refine((value) => !value || !isNaN(Date.parse(value)), {
                message: "Data inválida",
            }),

        updatedAt: z
            .string()
            .transform((value) => (value.trim() === "" ? undefined : value))
            .optional()
            .refine((value) => !value || !isNaN(Date.parse(value)), {
                message: "Data inválida",
            }),
        type: z.nativeEnum(PartnerSearchType).optional(),
        status: z.boolean(),
        obs: z.string()
    }).strict().partial().superRefine((data, ctx) => {
        console.log(data)
    });


