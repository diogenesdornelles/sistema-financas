
import { PartnerProps } from "./partner.interface";
import { TcpProps } from "./tcp.interface";
import { CPStatus } from "./utils/enums";

export interface CreateCp {
  // required na criação
  value: number;
  type: string; // Identificador de Tcp
  supplier: string; // Identificador de Partner
  due: Date;
  obs?: string;
  user?: string;
}

export interface UpdateCp {
  value?: number;
  type?: string;
  supplier?: string;
  due?: Date;
  obs?: string;
  user?: string;
  status?: CPStatus;
}

export interface CpProps {
  id: string;
  value: number;
  type: TcpProps;
  supplier: PartnerProps;
  due: Date;
  obs: string;
  status: CPStatus;
  createdAt: Date;
  updatedAt: Date;
}
