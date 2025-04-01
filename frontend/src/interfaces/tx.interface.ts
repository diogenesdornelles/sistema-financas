import { CatProps } from "./cat.interface";
import { CfProps } from "./cf.interface";
import { TransactionType } from "./utils/enums";


export interface CreateTx {
  value: number;
  type: TransactionType;
  cf: string; // Identificador de Cf
  description: string;
  user: string;
  category: string; // Identificador de Cat
  obs?: string;
}

export interface UpdateTx {
  value?: number;
  type?: TransactionType;
  cf?: string;
  description?: string;
  user?: string;
  category?: string;
  obs?: string;
  status?: boolean;
}

export interface TxProps {
  id: string;
  value: number;
  type: TransactionType;
  cf: CfProps;
  description: string;
  category: CatProps;
  obs: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
