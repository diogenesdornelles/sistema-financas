import { PartnerProps } from "./partner.dto";
import { TcrProps } from "./tcr.dto";
import { PaymentStatus } from "./utils/enums";

export interface CreateCr {
  value: number;
  type: string; // Identificador de Tcr
  customer: string; // Identificador de Partner
  due: Date;
  obs?: string;
  user: string;
}

export interface UpdateCr {
  value?: number;
  type?: string;
  customer?: string;
  due?: Date;
  obs?: string;
  user?: string;
  status?: PaymentStatus;
}

export interface CrProps {
  id: string;
  value: number;
  type: TcrProps;
  customer: PartnerProps;
  due: Date;
  obs: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
