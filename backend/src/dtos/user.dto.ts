export class CreateUserDto {
  // required em create
  name!: string;
  surname!: string;
  cpf!: string;
  pwd!: string;
}

export class UpdateUserDto {
  // todos opcionais
  name?: string;
  surname?: string;
  cpf?: string;
  pwd?: string;
  status?: boolean;
}

export class UserResponseDto {
  // Campos gerados e obrigatórios na resposta
  id!: string;
  name!: string;
  surname!: string;
  cpf!: string;
  status!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
