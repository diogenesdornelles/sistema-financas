export class CreateTokenDTO {
  cpf!: string;
  pwd!: string;
}

export class UpdateTokenDTO extends CreateTokenDTO {}

export class ResponseTokenDTO {
  user!: {
    cpf: string;
    name: string;
    id: string;
  };
  token!: string;
}
