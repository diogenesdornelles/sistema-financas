
import { PartnerProps } from "./partner.dto";
import { TcpProps } from "./tcp.dto";
import { CPStatus } from "./utils/enums";

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
  status?: CPStatus;
}

export interface CpProps {
  id: string;
  value: number;
  type: TcpProps;
  supplier: PartnerProps;
  due: string;
  obs: string;
  status: CPStatus;
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
  status?: CPStatus;
  createdAt?: string;
  updatedAt?: string;
}