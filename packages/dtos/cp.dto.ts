
import { PartnerProps } from "./partner.dto";
import { TcpProps } from "./tcp.dto";
import { TxProps } from "./tx.dto";
import { CPStatus } from "./utils/enums";

export interface CreateCp {
  // required na criação
  value: number;
  type: string; // Identificador de Tcp
  supplier: string; // Identificador de Partner
  due: Date;
  pdate?: Date;
  obs?: string;
  user: string;
  tx?: string;
}

export interface UpdateCp {
  value?: number;
  type?: string;
  supplier?: string;
  due?: Date;
  pdate?: Date;
  obs?: string;
  user?: string;
  status?: CPStatus;
  tx?: string;
}

export interface CpProps {
  id: string;
  value: number;
  type: TcpProps;
  supplier: PartnerProps;
  due: Date;
  obs: string;
  pdate?: Date;
  status: CPStatus;
  tx?: TxProps;
  createdAt: Date;
  updatedAt: Date;
}
