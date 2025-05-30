/*
Dtos para o trânsito de dados de Contas a pagar
*/

import { PartnerProps } from './partner.dto.js';
import { TcpProps } from './tcp.dto.js';
import { PaymentStatus } from './utils/enums.js';

export interface CreateCp {
  // required na criação
  value: string; // monetário como string.
  type: string; // Identificador de Tcp. É o UUID. Autocomplete input.
  supplier: string; // Identificador de Partner. È o UUID. Autocomplete input.
  due: string; // data do vencimento
  obs?: string;
  user: string; // é o UUID de user. Não precisa criar input. Será passado ao defaultValue do form
}

export interface UpdateCp {
  value?: string;
  type?: string;
  supplier?: string;
  due?: string;
  obs?: string;
}

export interface CpProps {
  id: string;
  value: number;
  type: TcpProps;
  supplier: PartnerProps;
  due: string;
  obs: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QueryCp {
  id?: string;
  value?: string;
  type?: string;
  supplier?: string;
  due?: string;
  obs?: string;
  status?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}
