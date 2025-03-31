export class CreateTcpDto {
  name!: string;
}

export class UpdateTcpDto {
  name?: string;
  status?: boolean;
}

export class TcpResponseDto {
  id!: string;
  name!: string;
  status!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
