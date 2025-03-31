import { createTxSchema } from "../create/create-tx.validator";


export const updateTxSchema = createTxSchema.partial();
