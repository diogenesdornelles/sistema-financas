export class CreateTcfDto {
  // required na criação
  name!: string;
}

export class UpdateTcfDto {
  name?: string;
  status?: boolean;
}

export class TcfResponseDto {
  id!: string;
  name!: string;
  status!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
