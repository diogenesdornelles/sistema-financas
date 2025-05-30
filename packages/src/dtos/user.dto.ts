/*
Dtos para o trânsito de dados de tipo de usuários
*/

import { RoleSearchType, RoleType } from './utils/enums.js';

export interface CreateUser {
  // required em create
  name: string;
  surname: string;
  cpf: string;
  pwd: string;
  role: RoleType;
}

export interface UpdateUser {
  // todos opcionais
  name?: string;
  surname?: string;
  cpf?: string;
  pwd?: string;
  status?: boolean;
  role?: RoleType;
}

export interface UserProps {
  id: string;
  name: string;
  surname: string;
  cpf: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  role: RoleType;
}

export interface QueryUser {
  id?: string;
  name?: string;
  surname?: string;
  cpf?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: RoleSearchType;
}
