import { PartnerProps } from "./partner.dto";
import { TcrProps } from "./tcr.dto";
import { TxProps } from "./tx.dto";
import { PaymentStatus } from "./utils/enums";

export interface CreateCr {
  value: string; // campo text com valor monetário
  type: string; // Identificador de Tcr
  customer: string; // Identificador de Partner
  due: string; // input date
  obs?: string;
  user: string; // não deve ser inserido
  tx?: string; // input autocomplete com uuid
}

export interface UpdateCr {
  value?: string;
  type?: string;
  customer?: string;
  due?: string;
  obs?: string;
  status?: PaymentStatus;
  tx?: string;
  rdate?: string;
}

export interface CrProps {
  id: string;
  value: number;
  type: TcrProps;
  customer: PartnerProps;
  due: Date;
  obs: string;
  tx?: TxProps;
  rdate?: Date;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}


export interface QueryCr {
  value?: string;
  type?: string;
  customer?: string;
  due?: string;
  obs?: string;
  tx?: string;
  rdate?: string;
  status?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}