import { createCrSchema } from '../create/createCrValidator';

export const updateCrSchema = createCrSchema.omit({ user: true }).partial();
