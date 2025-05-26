import { createCpSchema } from '../create/createCpValidator';

export const updateCpSchema = createCpSchema.omit({ user: true }).partial();
