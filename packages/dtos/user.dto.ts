/*
Dtos para o trânsito de dados de tipo de usuários
*/

export interface CreateUser {
  // required em create
  name: string;
  surname: string;
  cpf: string;
  pwd: string;
}

export interface UpdateUser {
  // todos opcionais
  name?: string;
  surname?: string;
  cpf?: string;
  pwd?: string;
  status?: boolean;
}

export interface UserProps {
  id: string;
  name: string;
  surname: string;
  cpf: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryUser {
  id?: string;
  name?: string;
  surname?: string;
  cpf?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}