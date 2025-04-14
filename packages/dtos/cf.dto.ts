import { TcfProps } from "./tcf.dto";

export interface CreateCf {
  // required na criação
  number: string;
  type: string; // Identificador de Tcf. Um UUID. Deve haver um input autocomplete com dados de Tcf da API. Mostrar nome Tcf para colher o id na seleção.
  user: string; // Identificador de User, um UUID, vem se session, não precisa inserir no formulário.
  // Opcional: balance (default 0.0), ag, bank, obs e status (default true)
  balance?: string;
  ag?: string;
  bank?: string;
  obs?: string;
}

export interface UpdateCf {
  // Todos opcionais na atualização
  number?: string;
  type?: string;
  balance?: string;
  ag?: string;
  bank?: string;
  obs?: string;
  status?: boolean;
}

export interface CfProps {
  id: string;
  number: string;
  balance: number;
  // Aqui podemos retornar o objeto Tcf ou somente seu id; neste exemplo, usamos o DTO de resposta
  type: TcfProps;
  // ag e bank podem ser nulos, mas na resposta serão retornados (podem ser string ou null)
  ag: string | null;
  bank: string | null;
  obs: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface QueryCf {
  id?: string;
  number?: string;
  balance?: string;
  type?: string;
  ag?: string;
  bank?: string;
  obs?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}