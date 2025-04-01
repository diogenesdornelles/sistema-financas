export interface CreateUse {
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
  // Campos gerados e obrigatórios na resposta
  id: string;
  name: string;
  surname: string;
  cpf: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
