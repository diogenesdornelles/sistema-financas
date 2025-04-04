import { PartnerProps } from "./partner.dto";
import { TcrProps } from "./tcr.dto";
import { TxProps } from "./tx.dto";
import { PaymentStatus } from "./utils/enums";

export interface CreateCr {
  value: number;
  type: string; // Identificador de Tcr
  customer: string; // Identificador de Partner
  due: Date;
  rdate?: Date;
  obs?: string;
  user: string;
  tx?: string;
}

export interface UpdateCr {
  value?: number;
  type?: string;
  customer?: string;
  due?: Date;
  obs?: string;
  status?: PaymentStatus;
  tx?: string;
  rdate?: Date;
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
