import { z } from 'zod';
import { GeneralValidator } from '../../GeneralValidator';

export const queryDbSchema = z.object({
  dateBalance: z.string().refine((dateString) => GeneralValidator.validateDateUntilPresent(dateString), {
    message: 'A data de balanço deve ser válida e menor ou igual à data atual.',
  }),
});
