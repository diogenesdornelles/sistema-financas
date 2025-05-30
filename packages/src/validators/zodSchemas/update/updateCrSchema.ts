import { createCrSchema } from '../create/createCrSchema.js';

export const updateCrSchema = createCrSchema.omit({ user: true }).partial();
