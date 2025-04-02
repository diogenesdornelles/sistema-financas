import { CatProps } from "./cat.dto";
import { CfProps } from "./cf.dto";
import { TransactionType } from "./utils/enums";


export interface CreateTx {
  value: number;
  type: TransactionType;
  cf: string; // Identificador de Cf
  description?: string;
  user: string;
  category: string; // Identificador de Cat
  obs?: string;
  rdate?: Date;
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
  rdate?: Date;
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
  rdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
