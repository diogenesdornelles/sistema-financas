/*
Dtos para o trânsito de dados de tipo de conta a receber
*/

export interface CreateTcr {
  name: string;
}

export interface UpdateTcr {
  name?: string;
  status?: boolean;
}

export interface TcrProps {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryTcr {
  id?: string;
  name?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
