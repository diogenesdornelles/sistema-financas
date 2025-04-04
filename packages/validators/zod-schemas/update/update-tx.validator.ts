import { createTxSchema } from "../create/create-tx.validator";


export const updateTxSchema = createTxSchema.partial().omit({user: true});
