
import { PartnerProps } from "./partner.dto";
import { TcpProps } from "./tcp.dto";
import { TxProps } from "./tx.dto";
import { CPStatus } from "./utils/enums";

export interface CreateCp {
  // required na criação
  value: string; // monetário como string.
  type: string; // Identificador de Tcp. É o UUID. Autocomplete input. 
  supplier: string; // Identificador de Partner. È o UUID. Autocomplete input.
  due: string; // data do vencimento
  obs?: string;
  user: string; // é o UUID de user. Não precisa criar input. Será passado ao defaultValue do form
  tx?: string; // é o UUID de de tx.id. Campo autocomplete. Deve mostrar tx.description para selação . 
}

export interface UpdateCp {
  value?: string;
  type?: string;
  supplier?: string;
  due?: string;
  pdate?: string;
  obs?: string;
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
