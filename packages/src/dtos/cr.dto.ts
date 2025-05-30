/*
Dtos para o trânsito de dados de Contas a receber
*/

import { PartnerProps } from './partner.dto.js';
import { TcrProps } from './tcr.dto.js';
import { PaymentStatus } from './utils/enums.js';

export interface CreateCr {
  value: string; // campo text com valor monetário
  type: string; // Identificador de Tcr
  customer: string; // Identificador de Partner
  due: string; // input date
  obs?: string;
  user: string; // não deve ser inserido
}

export interface UpdateCr {
  value?: string;
  type?: string;
  customer?: string;
  due?: string;
  obs?: string;
}

export interface CrProps {
  id: string;
  value: number;
  type: TcrProps;
  customer: PartnerProps;
  due: string;
  obs: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QueryCr {
  id?: string;
  value?: string;
  type?: string;
  customer?: string;
  due?: string;
  obs?: string;
  status?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}
