/*
Dtos para o trânsito de dados de tipo de transações
*/

import { CatProps } from './cat.dto.js';
import { CfProps } from './cf.dto.js';
import { CpProps } from './cp.dto.js';
import { CrProps } from './cr.dto.js';
import { TransactionSearchType, TransactionType } from './utils/enums.js';

export interface CreateTx {
  value: string;
  cf: string; // Identificador de Cf uuid
  cp?: string; // Identificador de Cp uuid. Ao menos um, entre cr cp, deve ser uuid.
  cr?: string; // Identificador de Cr uuid
  description: string;
  user: string; // uuid de user, não cria campo
  category: string; // Identificador de Cat
  obs?: string;
  tdate?: string; // data da transação
}

export interface UpdateTx {
  value?: string;
  cf?: string;
  cp?: string;
  cr?: string;
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
  cp?: CpProps;
  cr?: CrProps;
  description: string;
  category: CatProps;
  obs: string;
  status: boolean;
  tdate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryTx {
  id?: string;
  value?: string;
  type?: TransactionSearchType;
  cf?: string;
  cp?: string;
  cr?: string;
  description?: string;
  category?: string;
  obs?: string;
  status?: boolean;
  tdate?: string;
  createdAt?: string;
  updatedAt?: string;
}
