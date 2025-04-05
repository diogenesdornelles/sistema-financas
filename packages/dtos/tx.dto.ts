import { CatProps } from "./cat.dto";
import { CfProps } from "./cf.dto";
import { TransactionType } from "./utils/enums";


export interface CreateTx {
  value: string;
  type: TransactionType;
  cf: string; // Identificador de Cf uuid
  description: string; 
  user: string; // uuid de user, não cria campo
  category: string; // Identificador de Cat
  obs?: string;
  tdate?: string; // data da transação
}

export interface UpdateTx {
  value?: string;
  type?: TransactionType;
  cf?: string;
  description?: string;
  category?: string;
  obs?: string;
  status?: boolean;
  tdate?: string;
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
  tdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
