import { createCpSchema } from '../create/createCpSchema.js';

export const updateCpSchema = createCpSchema.omit({ user: true }).partial();
